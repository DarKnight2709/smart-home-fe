import z from 'zod'

export const LoginSchema = z
  .object({
    username: z.string().trim().min(1, 'Tên đăng nhập không được để trống'),
    password: z.string().trim().min(1, 'Mật khẩu không được để trống')
  })
  .strict()
  .strip()

export type LoginBodyType = z.infer<typeof LoginSchema>

export const LogoutSchema = z
  .object({
    refreshToken: z.string()
  })
  .strict()
  .strip()

export type LogoutBodyType = z.infer<typeof LogoutSchema>

export const RefreshTokenSchema = z
  .object({
    refreshToken: z.string()
  })
  .strict()
  .strip()

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenSchema>

export const LoginResponseSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string()
  })
  .strip()

export type LoginResponse = z.infer<typeof LoginResponseSchema>

export const RefreshTokenResponseSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string()
  })
  .strip()

export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>
