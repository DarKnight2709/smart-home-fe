import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  PasswordInput,
  PasswordInputInput,
  PasswordInputAdornmentToggle,
} from "@/shared/components/ui/password-input";
import { Label } from "@/shared/components/ui/label";

interface ChangeDoorPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (oldPassword: string, newPassword: string) => Promise<void>;
  isLoading?: boolean;
}

export const ChangeDoorPasswordDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: ChangeDoorPasswordDialogProps) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return;
    }

    await onSubmit(oldPassword, newPassword);
    
    // Reset form after successful submission
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    onOpenChange(newOpen);
  };

  const isFormValid = oldPassword && newPassword && confirmPassword && newPassword === confirmPassword;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu cửa</DialogTitle>
          <DialogDescription>
            Nhập mật khẩu cũ và mật khẩu mới để đổi mật khẩu cửa
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
              <PasswordInput>
                <PasswordInputInput
                  id="oldPassword"
                  placeholder="Nhập mật khẩu cũ"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <PasswordInputAdornmentToggle />
              </PasswordInput>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <PasswordInput>
                <PasswordInputInput
                  id="newPassword"
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <PasswordInputAdornmentToggle />
              </PasswordInput>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <PasswordInput>
                <PasswordInputInput
                  id="confirmPassword"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <PasswordInputAdornmentToggle />
              </PasswordInput>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-destructive">
                  Mật khẩu xác nhận không khớp
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={!isFormValid || isLoading}>
              {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

