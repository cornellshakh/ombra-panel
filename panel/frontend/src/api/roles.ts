import { Role, Permission } from "@/lib/schema";
import { apiDelete, apiPost, apiPut, ApiResponse, handleApiCall } from "./api";

export async function createRole(
  role: Role,
  toggleFetch: () => void,
  onClose?: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<Role>>("/create_role", {
    name: role.name,
    description: role.description,
    color: role.color,
    permissions: role.permissions.map(
      (permission: Permission) => permission.permissionId
    ),
  });

  await handleApiCall(
    toggleFetch,
    `Role ${response.name} created`,
    "Failed to create role. Please try again.",
    () => deleteRole(response, toggleFetch, undefined, true),
    onClose,
    undefined,
    response
  );
}

export async function undoDeleteRole(
  role: Role,
  toggleFetch: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<Role>>("/create_role", {
    role,
    roleId: role.roleId,
  });

  await handleApiCall(
    toggleFetch,
    `Role ${role.name} restored`,
    `Failed to restore role ${role.name}. Please try again.`,
    () => deleteRole(role, toggleFetch),
    undefined,
    true,
    response
  );
}

export async function editRole(
  role: Role,
  updatedRole: Role,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo?: boolean
): Promise<void> {
  const response = await apiPut<ApiResponse<string>>(
    `/edit_role/${role.roleId}`,
    {
      name: updatedRole.name,
      description: updatedRole.description,
      color: updatedRole.color,
      permissions: updatedRole.permissions?.map(
        (permission) => permission.permissionId
      ),
    }
  );

  await handleApiCall(
    toggleFetch,
    `Role ${role.name} updated`,
    "Failed to update role. Please try again.",
    () => editRole(updatedRole, role, toggleFetch, undefined, true),
    onClose,
    isUndo,
    response
  );
}

export async function deleteRole(
  role: Role,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo?: boolean
): Promise<void> {
  const response = await apiDelete<ApiResponse<string>>(
    `/delete_role/${role.roleId}`
  );

  await handleApiCall(
    toggleFetch,
    `Role ${role.name} deleted`,
    "Failed to delete role. Please try again.",
    () => undoDeleteRole(role, toggleFetch),
    onClose,
    isUndo,
    response
  );
}
