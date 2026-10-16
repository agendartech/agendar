import { X } from "lucide-react-native"
import { useState } from "react"
import { Modal, Text, TouchableOpacity, View } from "react-native"
import { deleteAccount } from "@/http/auth/delete-account"
import { useSession } from "@/providers/auth-context"
import { AppButton } from "./button"
import { PasswordInput } from "./password-input"
import { Toaster, toast } from "./toast"

interface DeleteAccountDialogProps {
  visible: boolean
  onClose: () => void
}

export function DeleteAccountDialog({
  visible,
  onClose,
}: DeleteAccountDialogProps) {
  const { signOut } = useSession()
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setPassword("")
    onClose()
  }

  const handleConfirm = async () => {
    if (!password) return

    setIsLoading(true)
    const { error } = await deleteAccount(password)
    setIsLoading(false)

    if (error) {
      toast.error(error)
      return
    }

    setPassword("")
    onClose()
    toast.success("Conta excluída com sucesso.")
    signOut()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
      transparent
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white rounded-lg w-full max-w-md">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-xl font-semibold text-red-600">
              Excluir conta
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              className="p-2"
              disabled={isLoading}
            >
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="p-4 gap-4">
            <View className="bg-red-50 border border-red-200 p-3 rounded-lg gap-2">
              <Text className="text-red-800 text-sm">
                Esta ação é permanente e não pode ser desfeita. Serão excluídos
                sua conta, seus estabelecimentos, profissionais, serviços,
                clientes e agendamentos.
              </Text>
              <Text className="text-red-800 text-sm">
                Sua assinatura será cancelada imediatamente, sem novas
                cobranças.
              </Text>
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700">
                Digite sua senha para confirmar
              </Text>
              <PasswordInput
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
            </View>

            {/* Actions */}
            <View className="gap-3 mt-2">
              <AppButton
                title="Excluir minha conta"
                onPress={handleConfirm}
                loading={isLoading}
                disabled={isLoading || !password}
                theme="danger"
              />
              <AppButton
                title="Voltar"
                onPress={handleClose}
                disabled={isLoading}
                theme="secondary"
              />
            </View>
          </View>
        </View>
      </View>
      <Toaster />
    </Modal>
  )
}
