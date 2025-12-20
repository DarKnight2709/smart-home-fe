import api from "@/shared/lib/api"
import { useQuery } from "@tanstack/react-query"

export interface RoomDevice {
  id: string
  name: string
  type: 'sensor' | 'actuator' | 'controller'
  status: 'online' | 'offline'
  capabilities: string[]
  lastSeen: Date | null
}

export interface RoomDetail {
  location: string
  devices: RoomDevice[]
  temperature?: number
  humidity?: number
  lightsOn: number
  lightsTotal: number
  doorsOpen: number
  doorsTotal: number
}

export const useGetRoomDetailQuery = (location: string) => {
  return useQuery({
    queryKey: ['room-detail', location],
    queryFn: async () => {
      const res = await api.get<RoomDetail>(`/v1/overview/rooms/${location}`)
      return res.data
    },
    refetchInterval: 30000, // Refetch mỗi 30 giây
    enabled: !!location,
  })
}

