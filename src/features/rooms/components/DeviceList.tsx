import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Plug,
  CheckCircle2,
  XCircle,
  DoorOpen,
  DoorClosed,
  Power,
} from "lucide-react";
import {useTurnOffLight, type RoomDevice } from "../api/RoomService";
import { DeviceType } from "@/shared/enums/device.enum";
import { Button } from "@/shared/components/ui/button";

interface DeviceListProps {
  devices: RoomDevice[];
  room: string
}

export const DeviceList = ({ devices, room }: DeviceListProps) => {
  const { mutateAsync: turnOffLight, isPending: isTurningOffLight } =
    useTurnOffLight(room);
  const devicesList = devices.map((device) => ({
    ...device,
    isOn: false,
    isControllable: true,
  }));

  const handleToggleDevice = (device: RoomDevice) => {
    turnOffLight({
      device,
      turnOn: true
    })
  };

  if (devicesList.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Chưa có thiết bị nào trong phòng này
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plug className="w-5 h-5" />
          Danh sách thiết bị ({devicesList.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {devicesList.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    device.status === "online"
                      ? "bg-green-100 dark:bg-green-900/20"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {device.status === "online" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{device.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {device.type === DeviceType.LIGHT
                      ? "Đèn"
                      : device.type === DeviceType.DOOR
                      ? "Cửa"
                      : device.type === DeviceType.GAS_SENSOR
                      ? "Cảm biến khí ga"
                      : device.type === DeviceType.LIGHT_SENSOR
                      ? "Cảm biến ánh sáng"
                      : "Cảm biến nhiệt độ, độ ẩm"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={device.status === "online" ? "default" : "secondary"}
                >
                  {device.status === "online" ? "Online" : "Offline"}
                </Badge>
                {/* NÚT ĐIỀU KHIỂN */}
                {device.isControllable && device.status === "online" && (
                  <Button
                    size="sm"
                    variant={device.isOn ? "destructive" : "default"}
                    onClick={() => {
                      // TODO: gọi API / socket
                      console.log("Toggle device", device.id);
                    }}
                    className="flex items-center gap-1"
                  >
                    {device.type === DeviceType.LIGHT ? (
                      <>
                        <Power className="w-4 h-4" />
                        {device.isOn ? "Tắt" : "Bật"}
                      </>
                    ) : (
                      <>
                        {device.isOn ? (
                          <DoorClosed className="w-4 h-4" />
                        ) : (
                          <DoorOpen className="w-4 h-4" />
                        )}
                        {device.isOn ? "Đóng" : "Mở"}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
