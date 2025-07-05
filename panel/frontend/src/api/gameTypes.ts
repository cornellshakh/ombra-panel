import { GameType } from "@/lib/schema";
import { apiDelete, apiPost, apiPut, ApiResponse, handleApiCall } from "./api";

export async function createGameType(
  gameType: GameType,
  toggleFetch: () => void,
  onClose?: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<GameType>>("/create_game_type", {
    name: gameType.name,
    description: gameType.description,
    color: gameType.color,
  });

  await handleApiCall(
    toggleFetch,
    `Game type ${response.name} created`,
    "Failed to create game type. Please try again.",
    () => deleteGameType(response, toggleFetch, undefined, true),
    onClose,
    undefined,
    response
  );
}

export async function undoDeleteGameType(
  gameType: GameType,
  toggleFetch: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<GameType>>("/create_game_type", {
    gameType,
    gameTypeId: gameType.gameTypeId,
  });

  await handleApiCall(
    toggleFetch,
    `Game type ${gameType.name} restored`,
    `Failed to restore game type ${gameType.name}. Please try again.`,
    () => deleteGameType(gameType, toggleFetch),
    undefined,
    true,
    response
  );
}

export async function editGameType(
  gameType: GameType,
  updatedGame: GameType,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo: boolean = false
): Promise<void> {
  const response = await apiPut<ApiResponse<string>>(
    `/edit_game_type/${gameType.gameTypeId}`,
    updatedGame
  );

  await handleApiCall(
    toggleFetch,
    `Game type ${gameType.name} updated`,
    "Failed to update game type. Please try again.",
    () => editGameType(updatedGame, gameType, toggleFetch, undefined, true),
    onClose,
    isUndo,
    response
  );
}

export async function deleteGameType(
  gameType: GameType,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo: boolean = false
): Promise<void> {
  const response = await apiDelete<ApiResponse<string>>(
    `/delete_game_type/${gameType.gameTypeId}`
  );

  await handleApiCall(
    toggleFetch,
    `Game type ${gameType.name} deleted`,
    "Failed to delete game type. Please try again.",
    () => undoDeleteGameType(gameType, toggleFetch),
    onClose,
    isUndo,
    response
  );
}
