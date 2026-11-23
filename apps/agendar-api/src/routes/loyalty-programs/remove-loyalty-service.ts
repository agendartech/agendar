import { and, eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { loyaltyPointRules, loyaltyPrograms } from "@/db/schema"
import { auth } from "@/middlewares/auth"
import { requireActiveSubscription } from "@/middlewares/require-active-subscription"
import { BadRequestError } from "@/routes/_erros/bad-request-error"

export async function removeLoyaltyService(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)
    typedApp.register(requireActiveSubscription)
    typedApp.delete(
      "/loyalty-programs/:programId/services/:serviceId",
      {
        schema: {
          tags: ["Loyalty"],
          summary: "Remove a service from a loyalty program",
          security: [{ bearerAuth: [] }],
          params: z.object({
            programId: z.string().uuid(),
            serviceId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { programId, serviceId } = request.params
        const { establishmentId } = await request.getCurrentEstablishmentId()

        const program = await db.query.loyaltyPrograms.findFirst({
          where: and(
            eq(loyaltyPrograms.id, programId),
            eq(loyaltyPrograms.establishmentId, establishmentId)
          ),
          columns: { id: true },
        })

        if (!program) {
          throw new BadRequestError("Programa de fidelidade não encontrado")
        }

        await db
          .delete(loyaltyPointRules)
          .where(
            and(
              eq(loyaltyPointRules.loyaltyProgramId, programId),
              eq(loyaltyPointRules.serviceId, serviceId)
            )
          )

        return reply.status(204).send()
      }
    )
  })
}
