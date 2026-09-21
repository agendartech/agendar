/**
 * Cores disponíveis para identificar um profissional na agenda.
 * O valor salvo no banco é o hex; web e mobile mantêm a mesma lista.
 */
export const EMPLOYEE_COLORS = [
  "#3b82f6", // azul
  "#ec4899", // rosa
  "#a855f7", // roxo
  "#10b981", // esmeralda
  "#f97316", // laranja
  "#06b6d4", // ciano
  "#f43f5e", // rosê
  "#f59e0b", // âmbar
  "#6366f1", // índigo
  "#14b8a6", // turquesa
  "#ef4444", // vermelho
  "#22c55e", // verde
  "#8b5cf6", // violeta
  "#d946ef", // fúcsia
  "#84cc16", // lima
  "#0ea5e9", // céu
  "#eab308", // amarelo
  "#78716c", // cinza
  "#92400e", // marrom
  "#1e3a8a", // marinho
] as const

export type EmployeeColor = (typeof EMPLOYEE_COLORS)[number]

export const DEFAULT_EMPLOYEE_COLOR: EmployeeColor = EMPLOYEE_COLORS[0]
