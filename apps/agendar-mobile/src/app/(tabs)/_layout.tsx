import { Tabs, useSegments } from "expo-router"
import {
  Activity,
  CalendarDays,
  Settings,
  ShoppingBag,
} from "lucide-react-native"
import { Image, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { useSession } from "@/providers/auth-context"

function HeaderRight() {
  return (
    <View className="mr-4">
      <Image
        source={require("../../../assets/agendar-logo.png")}
        className="w-8 h-8"
        resizeMode="contain"
      />
    </View>
  )
}

export default function Layout() {
  const { role } = useSession()
  const isEmployee = role === "employee"
  const segments = useSegments()
  const insets = useSafeAreaInsets()

  // Botão do WhatsApp só nas telas principais das abas; nas telas internas
  // (formulários) ele cobriria os botões de salvar no rodapé.
  const showWhatsApp = segments.length <= 2

  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12 },
          headerTitleStyle: { fontSize: 20 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: isEmployee ? "Minha Agenda" : "Agenda",
            headerShown: false,
            tabBarIcon: ({ color }) => <CalendarDays color={color} />,
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Relatórios",
            headerShown: true,
            headerRight: () => <HeaderRight />,
            tabBarIcon: ({ color }) => <Activity color={color} />,
            href: isEmployee ? null : undefined,
          }}
        />
        <Tabs.Screen
          name="my-dashboard"
          options={{
            title: "Meus Relatórios",
            headerShown: true,
            headerRight: () => <HeaderRight />,
            tabBarIcon: ({ color }) => <Activity color={color} />,
            href: isEmployee ? undefined : null,
          }}
        />
        <Tabs.Screen
          name="establishment"
          options={{
            title: "Loja",
            headerShown: false,
            tabBarIcon: ({ color }) => <ShoppingBag color={color} />,
            href: isEmployee ? null : undefined,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Configurações",
            headerShown: false,
            tabBarIcon: ({ color }) => <Settings color={color} />,
            href: isEmployee ? null : undefined,
          }}
        />
      </Tabs>
      {showWhatsApp && (
        <View
          pointerEvents="box-none"
          className="absolute right-0"
          style={{ bottom: insets.bottom + 49 }}
        >
          <WhatsAppButton />
        </View>
      )}
    </View>
  )
}
