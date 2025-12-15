import z from "zod"
import { PermissionSchema } from "./PermissionSchema"
import { BaseEntityDTO, MetaPagination } from "./CommonSchema"


export const RoleSchema = BaseEntityDTO.extend({
  name: z.string(),
  description: z.string(),
  isActive: z.boolean().default(true),
  isSystemRole: z.boolean().default(false),
  permissions: z.array(PermissionSchema),
})

export const PaginationRoleResponseSchema = z.object({
  data: z.array(RoleSchema),
  meta: MetaPagination
})

export const GetRoleQuerySchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  isSystemRole: z.boolean().optional(),
})

export const RolesResponseSchema = z.object({
  data: z.array(RoleSchema),
})
.strip()


export const CreateRoleSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  permissionIds: z.array(z.string()).optional()
})

export const UpdateRoleSchema = CreateRoleSchema


export type Role = z.infer<typeof RoleSchema>
export type PaginationRoleResponseType = z.infer<typeof PaginationRoleResponseSchema>
export type GetRoleQueryType = z.infer<typeof GetRoleQuerySchema>
export type RolesResponse = z.infer<typeof RolesResponseSchema>
export type CreateRole = z.infer<typeof CreateRoleSchema>
export type UpdateRole = z.infer<typeof UpdateRoleSchema>