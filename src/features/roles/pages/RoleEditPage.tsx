import { FormPageLayout } from "@/shared/components/FormPageLayout";
import { useNavigate, useParams } from "react-router";
import { useGetRoleDetailQuery, useUpdateRoleMutation } from "../api/RoleService";
import { RoleForm } from "../components/RoleForm";
import type { UpdateRole } from "@/shared/validations/RoleSchema";
import { withPermissionGuard } from "@/shared/components/WithPermissionGuard";
import { PERMISSIONS } from "@/shared/constants/permissions";

const RoleEditPageComponent = () => {
  // lấy id của role đó
  const { id } = useParams();
  const { data: roleResponse, isLoading } = useGetRoleDetailQuery(id);  

  const navigate = useNavigate();
  const { mutateAsync, isPending } = useUpdateRoleMutation(id || '');

  const handleSubmit = async (data: UpdateRole) => {
    await mutateAsync(data);
    navigate(-1);
  }

  return (
    <FormPageLayout
      title="Xem chi tiết vai trò"
      description={`Xem thông tin vai trò: ${
        roleResponse?.data.name || ""
      }`}
      isLoading={isLoading}
      notFoundMessage={!roleResponse ? "Không tìm thấy vai trò" : undefined}
    >
      {roleResponse && (
        <RoleForm
          mode="edit"
          role={roleResponse?.data}
          onSubmit={handleSubmit}
          isLoading={isPending}
        />
      )}
    </FormPageLayout>
  );
}

export const RoleEditPage = withPermissionGuard(
  RoleEditPageComponent,
  PERMISSIONS.ROLES.UPDATE
);
