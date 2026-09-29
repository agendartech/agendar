import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Briefcase, Calendar, Clock, Package } from "lucide-react-native"
import { Text, TouchableOpacity, View } from "react-native"
import type { Appointment } from "@/hooks/data/appointment/use-appointments"
import { Badge } from "./badge"

interface AppointmentCardProps {
  appointment: Appointment
  onCheckIn?: (appointmentId: string) => void
  onCancel?: (appointmentId: string) => void
}

const statusLabels: Record<Appointment["status"], string> = {
  scheduled: "Agendado",
  completed: "Concluído",
  canceled: "Cancelado",
}

export function AppointmentCard({
  appointment,
  onCheckIn,
  onCancel,
}: AppointmentCardProps) {
  const date = format(appointment.startTime, "dd/MM/yyyy", { locale: ptBR })
  const startTime = format(appointment.startTime, "HH:mm", { locale: ptBR })
  const endTime = format(appointment.endTime, "HH:mm", { locale: ptBR })
  const employeeColor = appointment.professional.color

  const showActions = appointment.status === "scheduled"

  return (
    <View className="mb-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg overflow-hidden">
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center flex-1 gap-1.5">
          <Text
            className="font-semibold text-gray-900 text-lg shrink"
            numberOfLines={1}
          >
            {appointment.customer.name}
          </Text>
          {appointment.package && (
            <View
              className={`flex-row items-center px-1.5 py-0.5 rounded-full ${
                appointment.package.paid ? "bg-green-100" : "bg-amber-100"
              }`}
            >
              <Package
                size={12}
                color={appointment.package.paid ? "#15803d" : "#b45309"}
              />
              <Text
                className={`ml-1 text-sm font-semibold ${
                  appointment.package.paid ? "text-green-800" : "text-amber-800"
                }`}
              >
                {appointment.package.remainingSessions}/
                {appointment.package.totalSessions}
              </Text>
            </View>
          )}
        </View>
        <Badge variant={appointment.status} textClassName="text-sm">
          {statusLabels[appointment.status]}
        </Badge>
      </View>

      <View className="mt-1.5 flex-row items-center gap-2">
        <View
          className="w-6 h-6 rounded-full items-center justify-center"
          style={{ backgroundColor: `${employeeColor}26` }}
        >
          <Briefcase size={13} color={employeeColor} />
        </View>
        <Text
          className="text-base font-medium shrink"
          style={{ color: employeeColor }}
          numberOfLines={1}
        >
          {appointment.professional.name}
        </Text>
        <Text className="text-base text-gray-400">•</Text>
        <Text className="text-base text-gray-700 flex-1" numberOfLines={1}>
          {appointment.service.name}
        </Text>
      </View>

      <View className="mt-1.5 flex-row items-center justify-between gap-2">
        <View className="flex-1 flex-row flex-wrap items-center gap-x-3 gap-y-1">
          <View className="flex-row items-center gap-1">
            <Calendar size={14} color="#6B7280" />
            <Text className="text-base text-gray-700" numberOfLines={1}>
              {date}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Clock size={14} color="#6B7280" />
            <Text className="text-base text-gray-500" numberOfLines={1}>
              {startTime} - {endTime}
            </Text>
          </View>
        </View>

        {showActions && (
          <View className="shrink-0 gap-1.5">
            <TouchableOpacity
              onPress={() => onCheckIn?.(appointment.id)}
              className="bg-blue-600 px-2.5 py-1.5 rounded-md items-center"
            >
              <Text className="text-white text-base font-semibold">
                Check-out
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onCancel?.(appointment.id)}
              className="border border-red-200 bg-red-50 px-2.5 py-1.5 rounded-md items-center"
            >
              <Text className="text-red-600 text-base font-semibold">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}
