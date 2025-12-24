import { PersonalInfoForm } from "../components/PersonalInfoForm";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { User, Lock } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
        </p>
      </div>

      <Tabs defaultValue="personal-info" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="personal-info" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Thông tin cá nhân
          </TabsTrigger>
          <TabsTrigger value="change-password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Đổi mật khẩu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal-info" className="mt-6">
          <PersonalInfoForm />
        </TabsContent>

        <TabsContent value="change-password" className="mt-6">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

