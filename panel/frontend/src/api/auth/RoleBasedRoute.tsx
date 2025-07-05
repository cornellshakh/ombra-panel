import { useAuthContext } from "@/api/auth/AuthProvider";
import { Role } from "@/lib/schema";
import { ComponentType } from "react";

interface RoleBasedRouteProps {
  RequiredRoleComponent: ComponentType;
  DefaultComponent: ComponentType;
  requiredRoles: Role[];
}

export default function RoleBasedRoute({
  RequiredRoleComponent,
  DefaultComponent,
  requiredRoles,
}: RoleBasedRouteProps) {
  const { user } = useAuthContext();

  // Since user.roles is an array of strings, check directly against requiredRoles
  const hasRequiredRole = user?.roles?.some((role) =>
    requiredRoles.includes(role)
  );

  if (hasRequiredRole) return <RequiredRoleComponent />;

  return <DefaultComponent />;
}
