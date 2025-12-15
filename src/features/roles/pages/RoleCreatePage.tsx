import { useNavigate } from "react-router"
import ROUTES from "@/shared/lib/routes"
import { FormPageLayout } from "../../../shared/components/FormPageLayout"
import { RoleForm } from "../components/RoleForm"
import { useCreateRoleMutation } from "../api/RoleService"
import type { CreateRole } from "@/shared/validations/RoleSchema"
import { withPermissionGuard } from "@/shared/components/WithPermissionGuard"
import { PERMISSIONS } from "@/shared/constants/permissions"


const RoleCreatePageComponent = () => {
  // lấy id của role đó

 const { mutateAsync, isPending} = useCreateRoleMutation()
  const navigate = useNavigate()

  const handleSubmit = async (data: CreateRole) => {
    await mutateAsync(data)
    navigate(ROUTES.ROLES.url)
  }

  return (
    <FormPageLayout title='Thêm vai trò mới' description='Điền thông tin để tạo vai trò'>
      <RoleForm mode='create' onSubmit={handleSubmit} isLoading={isPending} />
    </FormPageLayout>
  )
}


export const RoleCreatePage = withPermissionGuard(
  RoleCreatePageComponent,
  PERMISSIONS.ROLES.CREATE
)
