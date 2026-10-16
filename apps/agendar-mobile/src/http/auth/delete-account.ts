import { handleApiError } from "@/utils"
import { api } from "../api-client"

export async function deleteAccount(password: string) {
  try {
    await api.delete("/partner", { data: { password } })

    return {
      data: true,
      error: null,
    }
  } catch (err) {
    const { error } = handleApiError(err)

    return {
      data: null,
      error,
    }
  }
}
