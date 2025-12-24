import z from "zod";
import { PermissionSchema } from "./PermissionSchema";
import { BaseEntityDTO } from "./CommonSchema";
import { Gender } from "../lib/enum";

export const LoginSchema = z
  .object({
    username: z.string().trim().min(1, "Tên đăng nhập không được để trống"),
    password: z.string().trim().min(1, "Mật khẩu không được để trống"),
  })
  .strict()
  .strip();

export type LoginBodyType = z.infer<typeof LoginSchema>;

export const LogoutSchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict()
  .strip();

export type LogoutBodyType = z.infer<typeof LogoutSchema>;

export const RefreshTokenSchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict()
  .strip();

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenSchema>;

export const LoginResponseSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
  })
  .strip();

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const RefreshTokenResponseSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
  })
  .strip();

export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;

export const MeResponseSchema = BaseEntityDTO.extend({
  username: z.string(),
  fullName: z.string(),
  email: z.string().optional(),
  gender: z.enum(Gender),
  phone: z.string().nullable().optional(),
  currentAddress: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),

  roles: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      isActive: z.boolean(),
      isSystemRole: z.boolean(),
      description: z.string(),
      permissions: z.array(PermissionSchema),
    })
  ),
});

export type MeResponse = z.infer<typeof MeResponseSchema>;

export const UpdatePersonalInfoSchema = z
  .object({
    fullName: z.string().trim().min(1, "Họ và tên không được để trống").optional(),
    username: z.string().trim().min(1, "Tên đăng nhập không được để trống").optional(),
    gender: z.enum(Gender, { message: 'Giới tính không hợp lệ' }).optional(),
    phone: z.string().trim().optional().nullable(),
    email: z.string().email("Email không hợp lệ").optional().nullable(),
    currentAddress: z.string().trim().optional().nullable(),
    dateOfBirth: z.string().optional().nullable(),
  })
  .strict()
  .strip();

export type UpdatePersonalInfoBodyType = z.infer<typeof UpdatePersonalInfoSchema>;

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().trim().min(1, "Mật khẩu cũ không được để trống"),
    newPassword: z.string().trim().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  })
  .strict()
  .strip();

export type ChangePasswordBodyType = z.infer<typeof ChangePasswordSchema>;

export const UpdateProfileResponseSchema = z.object({
  message: z.string(),
});

export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;