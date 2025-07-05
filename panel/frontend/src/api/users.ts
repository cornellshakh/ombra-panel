import { User } from "@/lib/schema";
import { apiDelete, apiPost, apiPut, ApiResponse, handleApiCall } from "./api";

export function preprocessUserData(data: any): User {
  const directDateFields: string[] = ["registerDate", "lastEdit", "lastLogin"];

  directDateFields.forEach((field: string) => {
    data[field] = data[field] ? new Date(data[field]) : null;
  });

  if (data.subscription) {
    data.subscription.start = data.subscription.start
      ? new Date(data.subscription.start)
      : null;
    data.subscription.end = data.subscription.end
      ? new Date(data.subscription.end)
      : null;
  }

  return data as User;
}

export async function getUser(userId: number): Promise<User> {
  return await apiPost<User>(`/get_user/${userId}`);
}

export async function createRandomUser(
  toggleFetch: () => void,
  onClose: () => void
): Promise<void> {
  const response = await apiPost<User>("/create_random_user");

  await handleApiCall(
    toggleFetch,
    "Random user added",
    "Failed to create random user. Please try again.",
    () => deleteUser(response, toggleFetch, undefined, true),
    onClose,
    undefined,
    response
  );
}

export async function createUser(
  user: User,
  toggleFetch: () => void,
  onClose?: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<User>>("/create_user", user);

  await handleApiCall(
    toggleFetch,
    `User ${response.username} created`,
    "Failed to create user. Please try again.",
    () => deleteUser(response, toggleFetch, undefined, true),
    onClose,
    undefined,
    response
  );
}

export async function undoDeleteUser(
  user: User,
  toggleFetch: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<User>>("/create_user", {
    user: user,
    userId: user.userId,
  });

  await handleApiCall(
    toggleFetch,
    `User ${user.username} restored`,
    `Failed to restore user ${user.username}. Please try again.`,
    () => deleteUser(user, toggleFetch),
    undefined,
    true,
    response
  );
}

export async function editUser(
  user: User,
  updatedUser: User,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo: boolean = false
): Promise<void> {
  if (JSON.stringify(user) === JSON.stringify(updatedUser)) return;

  const response = await apiPut<ApiResponse<string>>(
    `/edit_user/${user.userId}`,
    updatedUser
  );

  await handleApiCall(
    toggleFetch,
    `User ${user.username} updated`,
    `Failed to update user ${user.username}. Please try again.`,
    () => editUser(updatedUser, user, toggleFetch, undefined, true),
    onClose,
    isUndo,
    response
  );
}

export async function deleteUser(
  user: User,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo: boolean = false
): Promise<void> {
  const response = await apiDelete<ApiResponse<string>>(
    `/delete_user/${user.userId}`
  );

  await handleApiCall(
    toggleFetch,
    `User ${user.username} deleted`,
    `Failed to delete user ${user.username}. Please try again.`,
    () => undoDeleteUser(user, toggleFetch),
    onClose,
    isUndo,
    response
  );
}

export async function updateUserStatus(
  user: User,
  suspendedById: number | undefined,
  newStatus: string,
  toggleFetch: () => void,
  isUndo: boolean = false
) {
  const response = await apiPut<ApiResponse<string>>(
    `/update_user_status/${user.userId}`,
    {
      suspendedBy: suspendedById,
      status: newStatus,
    }
  );

  await handleApiCall(
    toggleFetch,
    `Updated status of ${user.username} to ${newStatus}`,
    `Failed to update status of ${user.username}. Please try again.`,
    () =>
      updateUserStatus(user, suspendedById, user.status!, toggleFetch, true),
    undefined,
    isUndo,
    response
  );
}
