import { Check } from "lucide-react"
import { cn, employeeColorOptions } from "@/lib/utils"

interface EmployeeColorPickerProps {
  value: string
  onChange: (color: string) => void
  disabled?: boolean
}

export function EmployeeColorPicker({
  value,
  onChange,
  disabled,
}: EmployeeColorPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Cor do profissional"
      className="grid grid-cols-5 gap-3 sm:grid-cols-10"
    >
      {employeeColorOptions.map(option => {
        const selected = option.value === value.toLowerCase()

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.label}
            title={option.label}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full border-2 border-transparent outline-none transition-transform",
              "hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              selected && "border-background ring-2 ring-foreground"
            )}
            style={{ backgroundColor: option.value }}
          >
            {selected && <Check className="size-4 text-white" />}
          </button>
        )
      })}
    </div>
  )
}
