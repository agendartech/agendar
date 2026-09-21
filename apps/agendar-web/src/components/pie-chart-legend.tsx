import type { ChartConfig } from "@/components/ui/chart"

interface PieChartLegendProps {
  data: Record<string, unknown>[]
  config: ChartConfig
  nameKey: string
}

/**
 * Legenda dos gráficos de pizza, renderizada fora do SVG.
 *
 * Dentro do `<PieChart>` a legenda ocupa área do gráfico: quanto mais itens
 * quebram de linha, menor a pizza fica. Aqui ela fica abaixo do container,
 * então o tamanho da pizza não depende da quantidade de itens.
 */
export function PieChartLegend({ data, config, nameKey }: PieChartLegendProps) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-4 pb-4 text-xs">
      {data.map(item => {
        const key = String(item[nameKey])
        const itemConfig = config[key]

        return (
          <li key={key} className="flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-[2px]"
              style={{ backgroundColor: itemConfig?.color }}
            />
            <span>{itemConfig?.label ?? key}</span>
          </li>
        )
      })}
    </ul>
  )
}
