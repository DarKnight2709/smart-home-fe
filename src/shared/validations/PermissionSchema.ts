import { z } from 'zod'


export const PermissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  path: z.string(),
  method: z.string(),
  module: z.string()
})

export type PermissionType = z.infer<typeof PermissionSchema>
