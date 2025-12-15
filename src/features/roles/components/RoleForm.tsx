import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { InputBaseTextarea } from '@/shared/components/ui/input-base'
import { Separator } from '@/shared/components/ui/separator'
import { cn } from '@/shared/lib/utils'
import type { CreateRole, Role, UpdateRole } from '@/shared/validations/RoleSchema'
import { CreateRoleSchema } from '@/shared/validations/RoleSchema'
import { useGetAllPermissionsQuery } from '../api/RoleService'
import type { PermissionType } from '@/shared/validations/PermissionSchema'

interface RoleFormProps {
  role?: Role
  onSubmit?: (data: CreateRole | UpdateRole) => void
  isLoading?: boolean
  mode: 'create' | 'edit' | 'view'
}

export const RoleForm = ({ role, onSubmit, isLoading, mode }: RoleFormProps) => {
  const isViewMode = mode === 'view'

  const { data: permissionsResponse, isLoading: isLoadingPermissions } = useGetAllPermissionsQuery()
  const allPermissions = permissionsResponse?.data || []

  const permissionsByModule = useMemo(() => {
    const grouped: Record<string, PermissionType[]> = {}
    allPermissions.forEach((permission) => {
      const module = permission.module || 'Khác'
      if (!grouped[module]) grouped[module] = []
      grouped[module].push(permission)
    })
    return grouped
  }, [allPermissions])

  const form = useForm<CreateRole>({
    resolver: zodResolver(CreateRoleSchema) as any,
    defaultValues: {
      name: role?.name || undefined,
      description: role?.description || undefined,
      permissionIds: role?.permissions?.map((p) => p.id) || [],
    },
  })

  const handleSubmit = (data: CreateRole) => {
    if (onSubmit) onSubmit(data)
  }

  return (
    <Card className="py-0">
      <CardHeader className="sr-only">
        <CardTitle className="text-2xl">
          {mode === 'create' ? 'Thêm vai trò mới' : mode === 'edit' ? 'Chỉnh sửa vai trò' : 'Chi tiết vai trò'}
        </CardTitle>
        <CardDescription className="text-base">
          {mode === 'create'
            ? 'Điền đầy đủ thông tin để tạo vai trò mới trong hệ thống'
            : mode === 'edit'
            ? 'Cập nhật thông tin chi tiết của vai trò'
            : 'Xem thông tin chi tiết vai trò'}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Chi tiết vai trò */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Chi tiết vai trò</h3>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên vai trò *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên vai trò" {...field} disabled={isViewMode} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <InputBaseTextarea
                          placeholder="Nhập mô tả vai trò"
                          {...field}
                          disabled={isViewMode}
                          className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phân quyền */}
              <div className="space-y-4 lg:col-span-2">
                <h3 className="text-lg font-semibold text-primary">Phân quyền</h3>
                {isLoadingPermissions ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    Đang tải danh sách quyền...
                  </div>
                ) : Object.keys(permissionsByModule).length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">Không có quyền nào</div>
                ) : (
                  Object.entries(permissionsByModule).map(([module, permissions]) => (
                    <div key={module} className="space-y-3">
                      <h4 className="text-base font-medium border-b pb-2">{module}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {permissions.map((permission) => (
                          <FormField
                            key={permission.id}
                            control={form.control}
                            name="permissionIds"
                            render={({ field }) => {
                              const currentValue = field.value || []
                              const isChecked = currentValue.includes(permission.id)
                              return (
                                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-3">
                                  <FormControl>
                                    <Checkbox
                                      checked={isChecked}
                                      onCheckedChange={(checked) => {
                                        const value = field.value || []
                                        if (checked) field.onChange([...value, permission.id])
                                        else field.onChange(value.filter((id) => id !== permission.id))
                                      }}
                                      disabled={isViewMode}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm font-normal cursor-pointer">{permission.name}</FormLabel>
                                    {permission.description && (
                                      <p className="text-xs text-muted-foreground">{permission.description}</p>
                                    )}
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Separator />

            {mode !== 'view' && (
              <div className={cn('flex justify-end', form.formState.isDirty && 'sticky bottom-0 bg-background border rounded-lg border-input p-4')}>
                <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
                  {isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Thêm vai trò' : 'Cập nhật'}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
