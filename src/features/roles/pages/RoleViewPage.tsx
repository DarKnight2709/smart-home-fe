import { FormPageLayout } from "@/shared/components/FormPageLayout";
import { useParams } from "react-router";
import { useGetRoleDetailQuery } from "../api/RoleService";
import { RoleForm } from "../components/RoleForm";
import { withPermissionGuard } from "@/shared/components/WithPermissionGuard";
import { PERMISSIONS } from "@/shared/constants/permissions";

const RoleViewPageComponent = () => {
  // lấy id của role đó
  const { id } = useParams();
  const { data: roleResponse, isLoading } = useGetRoleDetailQuery(id); 


  return (
    <FormPageLayout
      title="Chỉnh sửa vai trò"
      description={`Chỉnh sửa vai trò: ${
        roleResponse?.data.name || ""
      }`}
      isLoading={isLoading}
      notFoundMessage={!roleResponse ? "Không tìm thấy vai trò" : undefined}
    >
      {roleResponse && (
        <RoleForm
          mode="view"
          role={roleResponse?.data}
        />
      )}
    </FormPageLayout>
  );
}


export const RoleViewPage = withPermissionGuard(
  RoleViewPageComponent,
  PERMISSIONS.ROLES.VIEW
);
