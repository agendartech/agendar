import { AxiosError } from "axios"

/**
 * Mensagem amigável para exibir em toast a partir de um erro de mutation.
 * Usa a mensagem enviada pela API quando existir.
 */
export function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? "Erro inesperado no servidor."
  }

  return "Erro desconhecido. Tente novamente mais tarde."
}
