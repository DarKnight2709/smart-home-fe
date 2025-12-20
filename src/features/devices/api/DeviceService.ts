import api from "@/shared/lib/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export interface Device {
  id: string
  name: string
  type: 'sensor' | 'actuator' | 'controller'
  status: 'online' | 'offline'
  lastSeen: Date | null
  capabilities: string[]
  location: string | null
  createdAt: Date
  updatedAt: Date
}

export const useGetDevicesQuery = (location?: string) => {
  return useQuery({
    queryKey: ['devices', location],
    queryFn: async () => {
      const params = location ? { location } : {}
      const res = await api.get<Device[]>('/v1/devices', { params })
      return res.data
    },
    refetchInterval: 5000,
  })
}

export const useControlLightMutation = () => {
  return useMutation({
    mutationFn: async ({ deviceId, state }: { deviceId: string; state: boolean }) => {
      return api.post(`/v1/mqtt/devices/${deviceId}/light`, { state })
    },
    onSuccess: () => {
      toast.success("Đã điều khiển đèn")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể điều khiển đèn")
    },
  })
}

export const useControlDoorMutation = () => {
  return useMutation({
    mutationFn: async ({ deviceId, state }: { deviceId: string; state: boolean }) => {
      return api.post(`/v1/mqtt/devices/${deviceId}/door`, { state })
    },
    onSuccess: () => {
      toast.success("Đã điều khiển cửa")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể điều khiển cửa")
    },
  })
}

