// Cores que o parceiro pode escolher para identificar um profissional.
// O valor (hex) é o que a API salva; a lista é validada no backend.
export const employeeColorOptions = [
  { label: "Azul", value: "#3b82f6" },
  { label: "Rosa", value: "#ec4899" },
  { label: "Roxo", value: "#a855f7" },
  { label: "Esmeralda", value: "#10b981" },
  { label: "Laranja", value: "#f97316" },
  { label: "Ciano", value: "#06b6d4" },
  { label: "Rosê", value: "#f43f5e" },
  { label: "Âmbar", value: "#f59e0b" },
  { label: "Índigo", value: "#6366f1" },
  { label: "Turquesa", value: "#14b8a6" },
  { label: "Vermelho", value: "#ef4444" },
  { label: "Verde", value: "#22c55e" },
  { label: "Violeta", value: "#8b5cf6" },
  { label: "Fúcsia", value: "#d946ef" },
  { label: "Lima", value: "#84cc16" },
  { label: "Céu", value: "#0ea5e9" },
  { label: "Amarelo", value: "#eab308" },
  { label: "Cinza", value: "#78716c" },
  { label: "Marrom", value: "#92400e" },
  { label: "Marinho", value: "#1e3a8a" },
]

export const DEFAULT_EMPLOYEE_COLOR = employeeColorOptions[0].value

/**
 * Primeira cor da lista que ainda não é usada por outro profissional.
 * Usada como sugestão inicial no cadastro (o parceiro pode trocar).
 */
export function suggestEmployeeColor(usedColors: string[]) {
  const used = new Set(usedColors.map(color => color.toLowerCase()))
  return (
    employeeColorOptions.find(option => !used.has(option.value))?.value ??
    DEFAULT_EMPLOYEE_COLOR
  )
}
