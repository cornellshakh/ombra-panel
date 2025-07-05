import { Permission } from "@/lib/schema";
import { apiDelete, apiPost, apiPut, ApiResponse, handleApiCall } from "./api";

export async function createPermission(
  permission: Permission,
  toggleFetch: () => void,
  onClose?: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<Permission>>("/create_permission", {
    name: permission.name,
    description: permission.description,
  });

  await handleApiCall(
    toggleFetch,
    `Permission ${response.name} created`,
    "Failed to create permission. Please try again.",
    () => deletePermission(response, toggleFetch, undefined, true),
    onClose,
    undefined,
    response
  );
}

export async function undoDeletePermission(
  permission: Permission,
  toggleFetch: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<Permission>>("/create_permission", {
    permission,
    permissionId: permission.permissionId,
  });

  await handleApiCall(
    toggleFetch,
    `Permission ${permission.name} restored`,
    `Failed to restore permission ${permission.name}. Please try again.`,
    () => deletePermission(permission, toggleFetch),
    undefined,
    true,
    response
  );
}

export async function editPermission(
  permission: Permission,
  updatedPermission: Permission,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo?: boolean
): Promise<void> {
  const response = await apiPut<ApiResponse<string>>(
    `/edit_permission/${permission.permissionId}`,
    updatedPermission
  );

  await handleApiCall(
    toggleFetch,
    `Permission ${permission.name} updated`,
    "Failed to update permission. Please try again.",
    () => editPermission(updatedPermission, permission, toggleFetch, undefined, true),
    onClose,
    isUndo,
    response
  );
}

export async function deletePermission(
  permission: Permission,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo?: boolean
): Promise<void> {
  const response = await apiDelete<ApiResponse<string>>(
    `/delete_permission/${permission.permissionId}`
  );

  await handleApiCall(
    toggleFetch,
    `Permission ${permission.name} deleted`,
    "Failed to delete permission. Please try again.",
    () => undoDeletePermission(permission, toggleFetch),
    onClose,
    isUndo,
    response
  );
}
