import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import { Linking, Text, TouchableOpacity, View } from "react-native"
import { AppButton } from "@/components/button"
import { DeleteAccountDialog } from "@/components/delete-account-dialog"
import { useSession } from "@/providers/auth-context"

export default function NotSubscription() {
  const PLANS_URL = `${process.env.EXPO_PUBLIC_WEB_URL}/#planos`
  const { signOut } = useSession()
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)

  function openPlansPage() {
    Linking.openURL(PLANS_URL)
  }

  return (
    <View className="flex-1 bg-[#001240] justify-center items-center px-6">
      <StatusBar style="light" />

      <Text className="text-white text-3xl font-semibold text-center mb-6">
        Nenhum plano ativo
      </Text>

      <Text className="text-white text-base text-center mb-10">
        Você ainda não possui um plano ativo. Para continuar utilizando nossos
        serviços, escolha um dos planos disponíveis no site.
      </Text>

      <AppButton
        title="Ver planos"
        className="w-full"
        onPress={openPlansPage}
      />

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
