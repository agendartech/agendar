import { CircleAlert, CircleCheck, Info } from "lucide-react-native"
import { useEffect, useId, useRef, useState } from "react"
import { Animated, Pressable, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

// Toast no estilo do sonner (web): aparece no topo, some sozinho e pode ser
// tocado para fechar. Chame `toast.success(...)` de qualquer lugar do app.

type ToastType = "success" | "error" | "info"

type ToastItem = {
  id: number
  type: ToastType
  title: string
  description?: string
}

type ToastOptions = {
  description?: string
  duration?: number
}

const DEFAULT_DURATION = 4000
const MAX_VISIBLE = 3

let nextId = 1
let toasts: ToastItem[] = []
const listeners = new Set<() => void>()
const timers = new Map<number, ReturnType<typeof setTimeout>>()

// Modais nativos ficam acima da árvore principal, então cada modal monta o seu
// próprio <Toaster />. Só o host montado por último (o que está no topo) exibe.
let hosts: string[] = []

function emit() {
  for (const listener of listeners) listener()
}

function dismiss(id: number) {
  clearTimeout(timers.get(id))
  timers.delete(id)
  toasts = toasts.filter(t => t.id !== id)
  emit()
}

function show(type: ToastType, title: string, options?: ToastOptions) {
  const id = nextId++
  toasts = [...toasts, { id, type, title, description: options?.description }]

  const overflow = toasts.slice(0, -MAX_VISIBLE)
  for (const t of overflow) dismiss(t.id)

  timers.set(
    id,
    setTimeout(() => dismiss(id), options?.duration ?? DEFAULT_DURATION)
  )
  emit()
  return id
}

export const toast = {
  success: (title: string, options?: ToastOptions) =>
    show("success", title, options),
  error: (title: string, options?: ToastOptions) =>
    show("error", title, options),
  info: (title: string, options?: ToastOptions) => show("info", title, options),
  dismiss,
}

// Mesmas cores do `richColors` do sonner usado no web
const typeStyles: Record<
  ToastType,
  { bg: string; border: string; text: string; Icon: typeof Info }
> = {
  success: {
    bg: "#ecfdf3",
    border: "#bffcd9",
    text: "#008a2e",
    Icon: CircleCheck,
  },
  error: {
    bg: "#fff0f0",
    border: "#ffe0e1",
    text: "#e60000",
    Icon: CircleAlert,
  },
  info: { bg: "#f0f8ff", border: "#d3e0fd", text: "#0973dc", Icon: Info },
}

export function Toaster() {
  const hostId = useId()
  const insets = useSafeAreaInsets()
  const [, forceRender] = useState(0)

  useEffect(() => {
    const listener = () => forceRender(n => n + 1)
    listeners.add(listener)
    hosts = [...hosts, hostId]
    emit()

    return () => {
      listeners.delete(listener)
      hosts = hosts.filter(h => h !== hostId)
      emit()
    }
  }, [hostId])

  if (hosts[hosts.length - 1] !== hostId || toasts.length === 0) return null

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: insets.top + 8,
        left: 16,
        right: 16,
        gap: 8,
        zIndex: 9999,
        elevation: 9999,
      }}
    >
      {toasts.map(item => (
        <ToastCard key={item.id} item={item} />
      ))}
    </View>
  )
}

function ToastCard({ item }: { item: ToastItem }) {
  const progress = useRef(new Animated.Value(0)).current
  const { bg, border, text, Icon } = typeStyles[item.type]

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [progress])

  return (
    <Animated.View
      style={{
        opacity: progress,
        transform: [
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [-16, 0],
            }),
          },
        ],
      }}
    >
      <Pressable
        onPress={() => dismiss(item.id)}
        accessibilityRole="alert"
        className="flex-row items-start gap-2 rounded-lg border px-4 py-3 shadow-md"
        style={{ backgroundColor: bg, borderColor: border }}
      >
        <Icon size={18} color={text} style={{ marginTop: 1 }} />
        <View className="flex-1">
          <Text className="text-sm font-medium" style={{ color: text }}>
            {item.title}
          </Text>
          {item.description ? (
            <Text className="mt-0.5 text-xs" style={{ color: text }}>
              {item.description}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  )
}
