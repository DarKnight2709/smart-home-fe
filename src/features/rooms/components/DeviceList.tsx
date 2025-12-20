import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Plug, CheckCircle2, XCircle } from "lucide-react"
import { type RoomDevice } from "../api/RoomService"

interface DeviceListProps {
  devices: RoomDevice[]
}

export const DeviceList = ({ devices }: DeviceListProps) => {
  if (devices.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Chưa có thiết bị nào trong phòng này</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plug className="w-5 h-5" />
          Danh sách thiết bị ({devices.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  device.status === 'online' 
                    ? 'bg-green-100 dark:bg-green-900/20' 
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  {device.status === 'online' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{device.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {device.type === 'sensor' ? 'Cảm biến' : 
                     device.type === 'actuator' ? 'Thiết bị điều khiển' : 
                     'Bộ điều khiển'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={device.status === 'online' ? 'default' : 'secondary'}>
                  {device.status === 'online' ? 'Online' : 'Offline'}
                </Badge>
                {device.capabilities && device.capabilities.length > 0 && (
                  <div className="flex gap-1">
                    {device.capabilities.map((cap) => (
                      <Badge key={cap} variant="outline" className="text-xs">
                        {cap === 'temperature' ? 'Nhiệt độ' :
                         cap === 'humidity' ? 'Độ ẩm' :
                         cap === 'light' ? 'Đèn' :
                         cap === 'door' ? 'Cửa' : cap}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

