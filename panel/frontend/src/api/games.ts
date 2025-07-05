import { Game } from "@/lib/schema";
import { apiDelete, apiPost, apiPut, ApiResponse, handleApiCall } from "./api";

export async function createGame(
  game: Game,
  toggleFetch: () => void,
  onClose?: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<Game>>("/create_game", {
    name: game.name,
    gameType: game.gameType,
    color: game.color,
  });

  await handleApiCall(
    toggleFetch,
    `Game ${response.name} created`,
    "Failed to create game. Please try again.",
    () => deleteGame(response, toggleFetch, undefined, true),
    onClose,
    undefined,
    response
  );
}

export async function undoDeleteGame(
  game: Game,
  toggleFetch: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<Game>>("/create_game", {
    game,
    gameId: game.gameId,
  });

  await handleApiCall(
    toggleFetch,
    `Game ${game.name} restored`,
    `Failed to restore game ${game.name}. Please try again.`,
    () => deleteGame(game, toggleFetch),
    undefined,
    true,
    response
  );
}

export async function editGame(
  game: Game,
  updatedGame: Game,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo: boolean = false
): Promise<void> {
  const response = await apiPut<ApiResponse<string>>(
    `/edit_game/${game.gameId}`,
    updatedGame
  );

  await handleApiCall(
    toggleFetch,
    `Game ${game.name} updated`,
    "Failed to update game. Please try again.",
    () => editGame(updatedGame, game, toggleFetch, undefined, true),
    onClose,
    isUndo,
    response
  );
}

export async function deleteGame(
  game: Game,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo: boolean = false
): Promise<void> {
  const response = await apiDelete<ApiResponse<string>>(
    `/delete_game/${game.gameId}`
  );

  await handleApiCall(
    toggleFetch,
    `Game ${game.name} deleted`,
    "Failed to delete game. Please try again.",
    () => undoDeleteGame(game, toggleFetch),
    onClose,
    isUndo,
    response
  );
}
