import { Suspension } from "@/lib/schema";
import { apiDelete, apiPost, apiPut, ApiResponse, handleApiCall } from "./api";
import { preprocessUserData } from "./users";

export function preprocessSuspensionData(data: any): Suspension {
  if (data.suspension) {
    data.suspension.start = data.suspension.start
      ? new Date(data.suspension.start)
      : null;
    data.suspension.end = data.suspension.end
      ? new Date(data.suspension.end)
      : null;
  }

  if (data.lastEdit) data.lastEdit = new Date(data.lastEdit);

  if (data.user) data.user = preprocessUserData(data.user);

  if (data.suspendedBy) data.suspendedBy = preprocessUserData(data.suspendedBy);

  return data as Suspension;
}

export async function getSuspension(suspensionId: number): Promise<Suspension> {
  return await apiPost<Suspension>(`/get_suspension/${suspensionId}`);
}

export async function createRandomSuspension(
  toggleFetch: () => void,
  onClose: () => void
): Promise<void> {
  const response = await apiPost<Suspension>("/create_random_suspension");

  await handleApiCall(
    toggleFetch,
    "Random suspension added",
    "Failed to create random suspension. Please try again.",
    () => deleteSuspension(response, toggleFetch, undefined, true),
    onClose,
    undefined,
    response
  );
}

export async function createSuspension(
  suspension: Suspension,
  toggleFetch: () => void,
  onClose?: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<Suspension>>(
    "/create_suspension",
    suspension
  );

  await handleApiCall(
    toggleFetch,
    `Suspension created for user ${response.user.userId}`,
    "Failed to create suspension. Please try again.",
    () => deleteSuspension(response, toggleFetch, undefined, true),
    onClose,
    undefined,
    response
  );
}

export async function undoDeleteSuspension(
  suspension: Suspension,
  toggleFetch: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<Suspension>>(
    "/create_suspension",
    {
      suspension: suspension,
      suspensionId: suspension.suspensionId,
    }
  );

  await handleApiCall(
    toggleFetch,
    `Suspension for user ${suspension.user.userId} restored`,
    `Failed to restore suspension for user ${suspension.user.userId}. Please try again.`,
    () => deleteSuspension(suspension, toggleFetch),
    undefined,
    true,
    response
  );
}

export async function editSuspension(
  suspension: Suspension,
  updatedSuspension: Suspension,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo: boolean = false
): Promise<void> {
  if (JSON.stringify(suspension) === JSON.stringify(updatedSuspension)) return;

  const response = await apiPut<ApiResponse<string>>(
    `/edit_suspension/${suspension.suspensionId}`,
    updatedSuspension
  );

  await handleApiCall(
    toggleFetch,
    `Suspension for user ${suspension.user.userId} updated`,
    `Failed to update suspension for user ${suspension.user.userId}. Please try again.`,
    () =>
      editSuspension(
        updatedSuspension,
        suspension,
        toggleFetch,
        undefined,
        true
      ),
    onClose,
    isUndo,
    response
  );
}

export async function deleteSuspension(
  suspension: Suspension,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo: boolean = false
): Promise<void> {
  const response = await apiDelete<ApiResponse<string>>(
    `/delete_suspension/${suspension.suspensionId}`
  );

  await handleApiCall(
    toggleFetch,
    `Suspension for user ${suspension.user.userId} deleted`,
    `Failed to delete suspension for user ${suspension.user.userId}. Please try again.`,
    () => undoDeleteSuspension(suspension, toggleFetch),
    onClose,
    isUndo,
    response
  );
}

export async function updateSuspensionStatus(
  suspension: Suspension,
  suspendedById: number | undefined,
  newStatus: string,
  toggleFetch: () => void,
  isUndo: boolean = false
) {
  const response = await apiPut<ApiResponse<string>>(
    `/update_suspension_status/${suspension.suspensionId}`,
    {
      suspendedBy: suspendedById,
      status: newStatus,
    }
  );

  await handleApiCall(
    toggleFetch,
    `Updated status of suspension for user ${suspension.user.userId} to ${newStatus}`,
    `Failed to update status of suspension for user ${suspension.user.userId}. Please try again.`,
    () =>
      updateSuspensionStatus(
        suspension,
        suspendedById,
        suspension.status!,
        toggleFetch,
        true
      ),
    undefined,
    isUndo,
    response
  );
}
