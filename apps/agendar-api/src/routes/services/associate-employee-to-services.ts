import { and, eq, inArray } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import { services } from "@/db/schema"
import { employeeServices } from "@/db/schema/employee-services"
import { employees as employeesTable } from "@/db/schema/employees"
import { auth } from "@/middlewares/auth"
import { BadRequestError } from "@/routes/_erros/bad-request-error"
import { commissionToDb } from "@/utils/commission"
import { establishmentHeaderSchema } from "@/utils/schemas/headers"

export async function associateEmployeesToService(app: FastifyInstance) {
  await app.register(async app => {
    const typedApp = app.withTypeProvider<ZodTypeProvider>()
    typedApp.register(auth)

    typedApp.post(
      "/services/:serviceId/employees",
      {
        schema: {
          tags: ["Service"],
          summary: "Associate employees to a service",
          security: [{ bearerAuth: [] }],
          headers: establishmentHeaderSchema,
          params: z.object({
            serviceId: z.string().uuid(),
          }),
          body: z.object({
            employees: z.array(
              z.object({
                id: z.string().uuid(),
                commission: z.string({
                  message: "Commission must be a string like '25' = 25%",
                }),
              })
            ),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { serviceId } = request.params
        const { employees } = request.body
        const { establishmentId } = await request.getCurrentEstablishmentId()

        const service = await db.query.services.findFirst({
          where: and(
            eq(services.id, serviceId),
            eq(services.establishmentId, establishmentId)
          ),
          columns: { id: true },
        })

        if (!service) {
          throw new BadRequestError("Serviço não encontrado")
        }

        // Valida antes do delete para um id inválido não apagar os vínculos.
        const employeeIds = [...new Set(employees.map(it => it.id))]
        if (employeeIds.length > 0) {
          const found = await db
            .select({ id: employeesTable.id })
            .from(employeesTable)
            .where(
              and(
                inArray(employeesTable.id, employeeIds),
                eq(employeesTable.establishmentId, establishmentId)
              )
            )

          if (found.length !== employeeIds.length) {
            throw new BadRequestError("Profissional não encontrado")
          }
        }

        await db
          .delete(employeeServices)
          .where(eq(employeeServices.serviceId, serviceId))

        if (employees.length > 0) {
          await db.insert(employeeServices).values(
            employees.map(employee => ({
              serviceId,
              employeeId: employee.id,
              commission: commissionToDb(employee.commission),
              active: true,
            }))
          )
        }

        return reply.status(204).send()
      }
    )
  })
}
