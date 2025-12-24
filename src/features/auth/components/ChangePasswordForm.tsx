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
import {
  PasswordInput,
  PasswordInputAdornmentToggle,
  PasswordInputInput,
} from "@/shared/components/ui/password-input";
import {
  type ChangePasswordBodyType,
  ChangePasswordSchema,
} from "@/shared/validations/AuthSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useChangePasswordMutation } from "../api/AuthService";
import { Loader2 } from "lucide-react";

export const ChangePasswordForm = () => {
  const { mutateAsync: changePassword, isPending } = useChangePasswordMutation();

  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const handleSubmit = async (data: ChangePasswordBodyType) => {
    try {
      await changePassword(data);
      form.reset();
    } catch (error) {
      // Error is handled by mutation
    }
  };

  return (
    <Card className="py-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          Đổi mật khẩu
        </CardTitle>
        <CardDescription className="text-base">
          Thay đổi mật khẩu của bạn. Sau khi đổi mật khẩu thành công, bạn sẽ cần đăng nhập lại.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4 max-w-md">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu cũ</FormLabel>
                    <FormControl>
                      <PasswordInput {...field}>
                        <PasswordInputInput
                          placeholder="Nhập mật khẩu cũ"
                          autoComplete="current-password"
                        />
                        <PasswordInputAdornmentToggle />
                      </PasswordInput>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <PasswordInput {...field}>
                        <PasswordInputInput
                          placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                          autoComplete="new-password"
                        />
                        <PasswordInputAdornmentToggle />
                      </PasswordInput>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-black text-white hover:bg-gray-800"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Đổi mật khẩu
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

