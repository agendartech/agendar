import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { DeleteAccountDialog } from "@/components/delete-account-dialog"
import { useSession } from "@/providers/auth-context"

export default function NotSubscription() {
  const { signOut } = useSession()
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)

  return (
    <View className="flex-1 bg-[#001240] justify-center items-center px-6">
      <StatusBar style="light" />

      <Text className="text-white text-3xl font-semibold text-center mb-6">
        Nenhum plano ativo
      </Text>

      {/* As lojas não permitem direcionar para compra externa
          (App Store 3.1.1, Google Play Payments). */}
      <Text className="text-white text-base text-center mb-10">
        Sua conta não possui um plano ativo no momento. Entre em contato com o
        suporte para mais informações.
      </Text>

      <TouchableOpacity onPress={signOut} className="py-3">
        <Text className="text-white text-base">Sair</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setDeleteDialogVisible(true)}
        className="py-3"
      >
        <Text className="text-white/60 text-sm">Excluir conta</Text>
      </TouchableOpacity>

      <DeleteAccountDialog
        visible={deleteDialogVisible}
        onClose={() => setDeleteDialogVisible(false)}
      />
    </View>
  )
}
