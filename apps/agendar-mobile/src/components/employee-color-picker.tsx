import { Check } from "lucide-react-native"
import { Pressable, View } from "react-native"
import { employeeColorOptions } from "@/utils/employee-colors"

type EmployeeColorPickerProps = {
  value?: string
  onChange: (color: string) => void
}

export function EmployeeColorPicker({
  value,
  onChange,
}: EmployeeColorPickerProps) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {employeeColorOptions.map(option => {
        const selected = option.value === value?.toLowerCase()

        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            onPress={() => onChange(option.value)}
            className={
              selected
                ? "w-10 h-10 rounded-full items-center justify-center border-2 border-black"
                : "w-10 h-10 rounded-full items-center justify-center border-2 border-transparent"
            }
          >
            <View
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: option.value }}
            >
              {selected && <Check size={16} color="white" />}
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}
