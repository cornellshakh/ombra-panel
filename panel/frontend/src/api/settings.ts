import { Settings } from "@/lib/schema";
import { apiPut, ApiResponse, handleApiCall } from "./api";

export async function editSettings(
  userId: number | undefined,
  settings: Settings,
  updatedSettings: Settings,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo: boolean = false
): Promise<void> {
  if (!userId) return;

  const response = await apiPut<ApiResponse<string>>(
    `/edit_user_settings/${userId}`,
    updatedSettings
  );

  handleApiCall(
    toggleFetch,
    "Settings updated",
    "Failed to update settings. Please try again.",
    () =>
      editSettings(
        userId,
        updatedSettings,
        settings,
        toggleFetch,
        undefined,
        true
      ),
    onClose,
    isUndo,
    response
  );
}

export async function editIndividualSetting(
  userId: number | undefined,
  settingName: string,
  currentSetting: string,
  updatedSetting: string,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo: boolean = false
): Promise<void> {
  if (!userId) return;

  const response = await apiPut<ApiResponse<string>>(
    `/edit_user_settings/${userId}`,
    {
      [settingName]: updatedSetting,
    }
  );

  handleApiCall(
    toggleFetch,
    "Settings updated",
    "Failed to update settings. Please try again.",
    () =>
      editIndividualSetting(
        userId,
        settingName,
        updatedSetting,
        currentSetting,
        toggleFetch,
        undefined,
        true
      ),
    onClose,
    isUndo,
    response
  );
}
