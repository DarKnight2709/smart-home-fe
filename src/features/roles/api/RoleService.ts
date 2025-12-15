import api from "@/shared/lib/api"
import API_ROUTES from "@/shared/lib/api-routes"
import { useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query"
import type { CreateRole, GetRoleQueryType, PaginationRoleResponseType, Role, UpdateRole } from "@/shared/validations/RoleSchema"
import type { PermissionType } from "@/shared/validations/PermissionSchema"
import { normalizeObject } from "@/shared/lib/utils"
import { toast } from "sonner"
import { queryClient } from "@/shared/components/ReactQueryProvider"



export const useGetRoleInfinite = (query: Partial<GetRoleQueryType>) => {
  return useInfiniteQuery({
    queryKey: ['roles-infinite', normalizeObject(query)],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<PaginationRoleResponseType>(`${API_ROUTES.ROLES}`, {
        params: normalizeObject({
          ...query,
          page: pageParam
        })
      })
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta) return undefined
      const { page, totalPages } = lastPage.meta
      if (page === undefined || totalPages === undefined) return undefined
      return page < totalPages ? page + 1 : undefined
    }
  })
}


export const useGetRolesQuery = (query?: Partial<GetRoleQueryType>) => {
  return useQuery({
    queryKey: ['roles', normalizeObject(query)],
    queryFn: () => api.get<PaginationRoleResponseType>(`${API_ROUTES.ROLES}`, { params: normalizeObject(query) })
  })
}

export const useDeleteRoleMutation = () => {
  return useMutation({
    mutationFn: (roleId: string) => api.delete(`${API_ROUTES.ROLES}/${roleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Xóa vai trò thành công')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Xóa vai trò thất bại')
    }
  })
}

export const useCreateRoleMutation = () => {
  return useMutation({
    mutationFn: (roleData: CreateRole) => api.post(API_ROUTES.ROLES, roleData),
    // chạy khi API tạo thành công
    onSuccess: async () => {
      // Invalidate all role-related queries
      await queryClient.invalidateQueries({ queryKey: ['roles'] })
      await queryClient.invalidateQueries({ queryKey: ['roles-infinite'] })
      // Refetch to ensure fresh data
      await queryClient.refetchQueries({ queryKey: ['roles'] })
      toast.success("Thêm vai trò thành công")
    },
    onError: (error: any) => {
      toast.error(error.message || "Thêm vai trò thất bại")
    }
  })
}

export const useGetRoleDetailQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ["role", id],
    queryFn: () => api.get<Role>(`${API_ROUTES.ROLES}/${id}`),
    enabled: !!id
  })
}

// AI
export const useGetAllPermissionsQuery = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: () => api.get<PermissionType[]>(API_ROUTES.PERMISSIONS)
  })
}

// AI
export const useUpdateRoleMutation = (id: string | undefined ) => {
  return useMutation({
    mutationFn: ( roleData: UpdateRole ) => 
      api.patch(`${API_ROUTES.ROLES}/${id}`, roleData),
    onSuccess: async () => {
      // Invalidate all role-related queries
      await queryClient.invalidateQueries({ queryKey: ['roles'] })
      await queryClient.invalidateQueries({ queryKey: ['roles-infinite'] })
      await queryClient.invalidateQueries({ queryKey: ['role', id] })
      // Refetch to ensure fresh data
      await queryClient.refetchQueries({ queryKey: ['roles'] })
      toast.success('Cập nhật vai trò thành công')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Cập nhật vai trò thất bại')
    }
  })
}