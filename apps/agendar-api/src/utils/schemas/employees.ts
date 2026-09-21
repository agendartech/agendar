import z from "zod"
import { EMPLOYEE_COLORS } from "@/utils/employee-colors"

export const employeeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email().nullable(),
  address: z.string().nullable(),
  active: z.boolean(),
  avatarUrl: z.string().nullable(),
  phone: z.string().nullable(),
  biography: z.string().nullable(),
  color: z.enum(EMPLOYEE_COLORS),
})
