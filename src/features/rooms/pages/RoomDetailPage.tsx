import { useParams, useNavigate } from "react-router"
import { useGetRoomDetailQuery } from "../api/RoomService"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { 
  ArrowLeft, 
  Loader2, 
  RefreshCw, 
  Thermometer, 
  Droplets, 
  Lightbulb, 
  DoorOpen
} from "lucide-react"
import { DeviceList } from "../components/DeviceList"
import { DeviceControl } from "../components/DeviceControl"
import ROUTES from "@/shared/lib/routes"

const getRoomName = (location: string) => {
  if (location === 'living-room') return 'Phòng khách'
  if (location === 'bedroom') return 'Phòng ngủ'
  if (location === 'kitchen') return 'Nhà bếp'
  if (location === 'bathroom') return 'Phòng tắm'
  return location || 'Chưa xác định'
}

export const RoomDetailPage = () => {
  const { location } = useParams<{ location: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isFetching, refetch } = useGetRoomDetailQuery(location || '')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-center text-muted-foreground">Không tìm thấy phòng</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(ROUTES.OVERVIEW.url)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{getRoomName(data.location)}</h1>
            <p className="text-sm text-muted-foreground">{data.location}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Thông tin cảm biến */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Thermometer className="w-5 h-5" />
              Nhiệt độ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.temperature !== undefined ? `${data.temperature}°C` : '--'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Droplets className="w-5 h-5" />
              Độ ẩm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.humidity !== undefined ? `${data.humidity}%` : '--'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thống kê thiết bị */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="w-5 h-5" />
              Đèn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.lightsOn} / {data.lightsTotal}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {data.lightsTotal > 0 
                ? `${Math.round((data.lightsOn / data.lightsTotal) * 100)}% đang bật`
                : 'Chưa có đèn'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DoorOpen className="w-5 h-5" />
              Cửa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.doorsOpen} / {data.doorsTotal}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {data.doorsTotal > 0 
                ? `${Math.round((data.doorsOpen / data.doorsTotal) * 100)}% đang mở`
                : 'Chưa có cửa'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Danh sách thiết bị */}
      <DeviceList devices={data.devices} />

      {/* Điều khiển thiết bị */}
      <DeviceControl devices={data.devices} />
    </div>
  )
}

