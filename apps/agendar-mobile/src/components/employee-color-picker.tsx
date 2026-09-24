import { Check } from "lucide-react-native"
import { Pressable, View } from "react-native"
import { employeeColorOptions } from "@/utils/employee-colors"

type EmployeeColorPickerProps = {
  value?: string
  onChange: (color: string) => void
  disabled?: boolean
}

// Mesmo layout do seletor do web: grade de 5 colunas com círculos de 32px e
// anel escuro em volta da cor selecionada.
export function EmployeeColorPicker({
  value,
  onChange,
  disabled,
}: EmployeeColorPickerProps) {
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel="Cor do profissional"
      className="flex-row flex-wrap"
      style={{ rowGap: 12, opacity: disabled ? 0.5 : 1 }}
    >
      {employeeColorOptions.map(option => {
        const selected = option.value === value?.toLowerCase()

        return (
          <View key={option.value} className="w-1/5 items-center">
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled }}
              accessibilityLabel={option.label}
              disabled={disabled}
              onPress={() => onChange(option.value)}
              className="w-10 h-10 rounded-full items-center justify-center border-2"
              style={{ borderColor: selected ? "#111827" : "transparent" }}
            >
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: option.value }}
              >
                {selected && <Check size={16} color="white" />}
              </View>
            </Pressable>
          </View>
        )
      })}
    </View>
  )
}
