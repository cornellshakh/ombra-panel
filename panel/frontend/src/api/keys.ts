import { Key, UserIdentity } from "@/lib/schema"; // Use UserIdentity instead of User
import { apiDelete, apiPost, apiPut, ApiResponse, handleApiCall } from "./api";
import { preprocessUserData } from "./users";

export function preprocessKeyData(data: any): Key {
  const directDateFields: string[] = ["createdAt", "usedAt"];

  directDateFields.forEach((field: string) => {
    if (data[field]) data[field] = new Date(data[field]);
    else data[field] = null;
  });

  if (data.createdBy) data.createdBy = preprocessUserData(data.createdBy);

  if (data.usedBy) data.usedBy = preprocessUserData(data.usedBy);

  return data as Key;
}

export async function createKey(
  key: Key,
  numKeys: number,
  createdBy: UserIdentity, // Use UserIdentity here
  toggleFetch: () => void,
  onClose?: () => void
): Promise<void> {
  for (let i = 0; i < numKeys; i++) {
    const response = await apiPost<ApiResponse<Key>>("/create_key", {
      createdBy: createdBy.userId, // Send only the userId from UserIdentity
      gameType: key.gameType,
      game: key.game,
    });

    await handleApiCall(
      toggleFetch,
      `Key ${response.keyId} created`,
      "Failed to create key. Please try again.",
      () => deleteKey(response, toggleFetch, undefined, true),
      onClose,
      undefined,
      response
    );
  }
}

export async function undoDeleteKey(
  key: Key,
  toggleFetch: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<Key>>("/create_key", {
    key,
    keyId: key.keyId,
  });

  await handleApiCall(
    toggleFetch,
    `Key ${key.keyId} restored successfully`,
    "Failed to restore key. Please try again.",
    () => deleteKey(key, toggleFetch),
    undefined,
    true,
    response
  );
}

export async function editKey(
  key: Key,
  newKey: Key,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo: boolean = false
): Promise<void> {
  if (JSON.stringify(newKey) === JSON.stringify(key)) return;

  const response = await apiPut<ApiResponse<string>>(
    `/edit_key/${key.keyId}`,
    newKey
  );

  await handleApiCall(
    toggleFetch,
    `Key ${key.keyId} updated successfully`,
    "Failed to update key. Please try again.",
    () => editKey(newKey, key, toggleFetch, undefined, true),
    onClose,
    isUndo,
    response
  );
}

export async function deleteKey(
  key: Key,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo: boolean = false
): Promise<void> {
  const response = await apiDelete<ApiResponse<string>>(
    `/delete_key/${key.keyId}`
  );

  await handleApiCall(
    toggleFetch,
    `Key ${key.keyId} deleted successfully`,
    "Failed to delete key. Please try again.",
    () => undoDeleteKey(key, toggleFetch),
    onClose,
    isUndo,
    response
  );
}

export async function useKey(
  key: Key,
  userId: number,
  toggleFetch: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<string>>(
    `/use_key/${key.keyId}`,
    userId
  );

  await handleApiCall(
    toggleFetch,
    "Key used successfully",
    "Failed to use key. Please try again.",
    undefined,
    undefined,
    undefined,
    response
  );
}
