import axios from "axios"
import { env } from "@/env"
import type { AuthResponse } from "@/http/auth/login"
import { clearToken } from "@/lib/auth"

// Usa axios sem o interceptor do api-client: a conta excluída é a das
// credenciais informadas, não a sessão que estiver salva no navegador.
const client = axios.create({ baseURL: env.VITE_API_URL })

export async function deleteAccount(email: string, password: string) {
  const { data } = await client.post<AuthResponse>("/login", {
    email,
    password,
  })

  await client.delete("/partner", {
    data: { password },
    headers: { Authorization: `Bearer ${data.token}` },
  })

  clearToken()
}
