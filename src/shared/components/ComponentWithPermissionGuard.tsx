import { useMeQuery } from "@/features/auth/api/AuthService";
import { hasPermission, type PermissionRequirement } from "../lib/utils"

interface ComponentWithPermissionGuardProps {
  permission: PermissionRequirement
  children: React.ReactNode
}

export const ComponentWithPermissionGuard = ({permission, children}: ComponentWithPermissionGuardProps) => {
  const { data: selfInfo} = useMeQuery();
  const permissions =
    selfInfo?.data?.roles.flatMap((role) => role.permissions) || [];

  const hasAccess = hasPermission(permissions, permission);
  if (!hasAccess) {
    return null;
  }
  return children;

}
  