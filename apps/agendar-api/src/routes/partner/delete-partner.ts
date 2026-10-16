import bcrypt from "bcrypt"
import { eq, inArray } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import Stripe from "stripe"
import z from "zod"
import { stripe } from "@/clients/stripe"
import { db } from "@/db"
import {
  employees,
  fcmTokens,
  partners,
  prePartners,
  verifications,
} from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { ForbiddenError } from "@/routes/_erros/forbidden-request-error"
import { UnauthorizedError } from "@/routes/_erros/unauthorized-error"

// Exclusão de conta exigida pela App Store (5.1.1(v)) e pelo Google Play.
// Apaga o parceiro e, via cascade, estabelecimentos, funcionários, clientes,
// agendamentos e assinatura. O cliente no Stripe também é removido, o que
// cancela imediatamente qualquer assinatura ativa.
export async function deletePartner(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.delete(
      "/partner",
      {
        schema: {
          tags: ["Partner"],
          summary: "Permanently delete the authenticated partner account",
          security: [{ bearerAuth: [] }],
          body: z.object({
            password: z.string().min(1),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const partnerId = await request.getCurrentPartnerId()

        // getCurrentPartnerId() aceita token de funcionário e devolve o dono,
        // então o papel precisa ser checado aqui.
        const { role } = await request.jwtVerify<{ role?: string }>()
        if (role === "employee") {
          throw new ForbiddenError(
            "Apenas o proprietário pode excluir a conta."
          )
        }
        const { password } = request.body

        const partner = await db.query.partners.findFirst({
          where: eq(partners.id, partnerId),
          with: {
            establishments: { columns: { id: true } },
          },
        })

        if (!partner) {
          throw new UnauthorizedError("Usuário não encontrado")
        }

        const isPasswordValid = await bcrypt.compare(password, partner.password)
        if (!isPasswordValid) {
          throw new UnauthorizedError("Senha incorreta")
        }

        try {
          await stripe.customers.del(partner.integrationPaymentId)
        } catch (err) {
          const alreadyDeleted =
            err instanceof Stripe.errors.StripeError &&
            err.code === "resource_missing"
          if (!alreadyDeleted) throw err
        }

        const establishmentIds = partner.establishments.map(e => e.id)
        const employeeIds =
          establishmentIds.length > 0
            ? (
                await db
                  .select({ id: employees.id })
                  .from(employees)
                  .where(inArray(employees.establishmentId, establishmentIds))
              ).map(e => e.id)
            : []

        await db.transaction(async tx => {
          await tx
            .delete(fcmTokens)
            .where(
              inArray(fcmTokens.userId, [
                partner.id,
                ...establishmentIds,
                ...employeeIds,
              ])
            )
          await tx
            .delete(verifications)
            .where(eq(verifications.identifier, partner.email))
          await tx
            .delete(prePartners)
            .where(eq(prePartners.email, partner.email))
          await tx.delete(partners).where(eq(partners.id, partner.id))
        })

        request.log.info({ partnerId }, "Partner account deleted")

        return reply.status(204).send()
      }
    )
  })
}
