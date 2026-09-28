import { Eye, EyeOff } from "lucide-react-native"
import React from "react"
import { Pressable, type TextInputProps, View } from "react-native"
import { Input } from "@/components/input"
import { cn } from "@/utils/cn"

function PasswordInput({ className, ...props }: TextInputProps) {
  const [visible, setVisible] = React.useState(false)

  return (
    <View className="relative justify-center">
      <Input
        {...props}
        className={cn("pr-14", className)}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Pressable
        onPress={() => setVisible(v => !v)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={visible ? "Ocultar senha" : "Mostrar senha"}
        className="absolute right-0 h-full px-4 justify-center"
      >
        {visible ? (
          <EyeOff size={22} color="#6B7280" />
        ) : (
          <Eye size={22} color="#6B7280" />
        )}
      </Pressable>
    </View>
  )
}

export { PasswordInput }
