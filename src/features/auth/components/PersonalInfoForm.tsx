import React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Gender } from "@/shared/lib/enum";
import {
  type UpdatePersonalInfoBodyType,
  UpdatePersonalInfoSchema,
} from "@/shared/validations/AuthSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUpdatePersonalInfoMutation, useMeQuery } from "../api/AuthService";
import { Loader2 } from "lucide-react";

export const PersonalInfoForm = () => {
  const { data: userData, isLoading: isLoadingUser } = useMeQuery();
  const user = userData?.data;
  const { mutateAsync: updatePersonalInfo, isPending } = useUpdatePersonalInfoMutation();

  const form = useForm<UpdatePersonalInfoBodyType>({
    resolver: zodResolver(UpdatePersonalInfoSchema),
    defaultValues: {
      fullName: user?.fullName || undefined,
      username: user?.username || undefined,
      gender: user?.gender,
      dateOfBirth: user?.dateOfBirth 
        ? user.dateOfBirth.split('T')[0] 
        : undefined,
      email: user?.email || undefined,
      phone: user?.phone || undefined,
      currentAddress: user?.currentAddress || undefined,
    },
  });

  // Update form when user data is loaded
  React.useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || undefined,
        username: user.username || undefined,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth 
          ? user.dateOfBirth.split('T')[0] 
          : undefined,
        email: user.email || undefined,
        phone: user.phone || undefined,
        currentAddress: user.currentAddress || undefined,
      });
    }
  }, [user, form]);

  const handleSubmit = async (data: UpdatePersonalInfoBodyType) => {
    try {
      await updatePersonalInfo(data);
    } catch (error) {
      // Error is handled by mutation
    }
  };

  if (isLoadingUser) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          Thông tin cá nhân
        </CardTitle>
        <CardDescription className="text-base">
          Cập nhật thông tin cá nhân của bạn
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Thông tin cơ bản */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Thông tin cơ bản
                </h3>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập họ và tên đầy đủ"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới tính</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={Gender.MALE}>Nam</SelectItem>
                          <SelectItem value={Gender.FEMALE}>Nữ</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày sinh</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Thông tin liên hệ */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Thông tin liên hệ
                </h3>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Nhập email"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập số điện thoại"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ hiện tại</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập địa chỉ hiện tại"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Thông tin tài khoản */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Thông tin tài khoản
                </h3>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-black text-white hover:bg-gray-800"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

