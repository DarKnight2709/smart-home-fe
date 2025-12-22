import { queryClient } from "@/shared/components/ReactQueryProvider"
import type { DeviceStatus, DeviceType } from "@/shared/enums/device.enum"
import api from "@/shared/lib/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export interface RoomDevice {
  id: string
  name: string
  type: DeviceType
  status: DeviceStatus
  lastState: string
}

export interface RoomDetail {
  location: string
  devices: RoomDevice[]
  temperature?: number
  humidity?: number,
  gasLevel?: number,
  lightLevel?: number,
  hasWarning?: string,
  warningMessage?: string,
  lightsOn: number
  lightsTotal: number
  doorsOpen: number
  doorsTotal: number
  devicesOnline: number
  devicesTotal: number
}

export const useGetRoomDetailQuery = (location: string) => {
  return useQuery({
    queryKey: ['room-detail', location],
    queryFn: async () => {
      const res = await api.get<RoomDetail>(`/v1/${location}/details`)
      console.log(res.data);
      return res.data
    },
    refetchInterval: 30000, // Refetch mỗi 30 giây
    enabled: !!location,
  })
}


export const useTurnOffLight = (room: string) => {
  return useMutation({
    mutationFn: async ({
      device,
      turnOn,
    }: {
      device: RoomDevice;
      turnOn: boolean;
    }) => {
  
      await api.patch(`/v1/${room}/light/${device.id}`, { state: turnOn })
        
      return { success: true };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['overview'] });
      toast.success("Đã cập nhật trạng thái tất cả đèn");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể cập nhật trạng thái đèn");
    }
  });
};
