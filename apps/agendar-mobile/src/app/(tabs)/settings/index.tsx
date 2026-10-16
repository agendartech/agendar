import {
  ChevronRight,
  Headset,
  LogOut,
  ShieldCheck,
  Trash2,
} from "lucide-react-native"
import { useState } from "react"
import { Linking, Pressable, Text, View } from "react-native"
import { DeleteAccountDialog } from "@/components/delete-account-dialog"
import { useSession } from "@/providers/auth-context"

const WHATSAPP_URL = "https://wa.me/5527992024223"
const PRIVACY_URL = `${process.env.EXPO_PUBLIC_WEB_URL}/privacidade`

export default function Settings() {
  const { signOut } = useSession()
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)

  return (
    <View className="flex-1 bg-white">
      <View className="mt-2 px-4">
        <Pressable
          onPress={() => Linking.openURL(WHATSAPP_URL)}
          className="flex-row items-center justify-between p-2 py-6 border-gray-100"
        >
          <View className="flex-row gap-4 flex-1 items-center">
            <Headset size={24} color={"#25D366"} className="mt-1" />
            <View className="flex-1">
              <Text className="text-base font-medium">Suporte</Text>
              <Text className="text-sm text-gray-500">
                Fale com o suporte via WhatsApp
              </Text>
            </View>
          </View>
          <ChevronRight
            size={20}
            className="mt-1 text-gray-400"
            color={"#9ca3af"}
          />
        </Pressable>
        <Pressable
          onPress={() => Linking.openURL(PRIVACY_URL)}
          className="flex-row items-center justify-between p-2 py-6 border-gray-100"
        >
          <View className="flex-row gap-4 flex-1 items-center">
            <ShieldCheck size={24} color={"#6b7280"} className="mt-1" />
            <View className="flex-1">
              <Text className="text-base font-medium">
                Política de privacidade
              </Text>
              <Text className="text-sm text-gray-500">
                Saiba como tratamos seus dados
              </Text>
            </View>
          </View>
          <ChevronRight
            size={20}
            className="mt-1 text-gray-400"
            color={"#9ca3af"}
          />
        </Pressable>
        <Pressable
          onPress={() => setDeleteDialogVisible(true)}
          className="flex-row items-center justify-between p-2 py-6 border-gray-100"
        >
          <View className="flex-row gap-4 flex-1 items-center">
            <Trash2 size={24} color={"#6b7280"} className="mt-1" />
            <View className="flex-1">
              <Text className="text-base font-medium">Excluir conta</Text>
              <Text className="text-sm text-gray-500">
                Apague permanentemente sua conta e seus dados
              </Text>
            </View>
          </View>
          <ChevronRight
            size={20}
            className="mt-1 text-gray-400"
            color={"#9ca3af"}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            signOut()
          }}
          className="flex-row items-center justify-between p-2 py-6  border-gray-100 text-red-400"
        >
          <View className="flex-row gap-4 flex-1 items-center">
            <LogOut size={24} color={"#ff0000"} className=" mt-1" />
            <View className="flex-1">
              <Text className="text-base font-medium text-red-400">Sair</Text>
            </View>
          </View>
          <ChevronRight
            size={20}
            className="mt-1 text-red-400"
            color={"#ff0000"}
          />
        </Pressable>
      </View>
      <DeleteAccountDialog
        visible={deleteDialogVisible}
        onClose={() => setDeleteDialogVisible(false)}
      />
    </View>
  )
}
