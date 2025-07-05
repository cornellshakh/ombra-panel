import { useFetchContext } from "@/api/FetchProvider";
import { deleteGame } from "@/api/games";
import { deleteGameType } from "@/api/gameTypes";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import CreateGameModal from "@/components/modals/CreateGameModal";
import CreateGameTypeModal from "@/components/modals/CreateGameTypeModal";
import EditGameModal from "@/components/modals/EditGameModal";
import EditGameTypeModal from "@/components/modals/EditGameTypeModal";
import { Game, GameType } from "@/lib/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";
import { Heading } from "@@/ui/heading";
import { Separator } from "@@/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@@/ui/tabs";
import { MinusIcon, PencilIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Games() {
  const { t } = useTranslation();
  const { toggleFetch, games, gameTypes } = useFetchContext();

  const [selectedGame, setSelectedGame] = useState<Game | undefined>(undefined);
  const [openCreateGame, setOpenCreateGame] = useState<boolean>(false);
  const [openEditGame, setOpenEditGame] = useState<boolean>(false);

  const [selectedGameType, setSelectedGameType] = useState<
    GameType | undefined
  >(undefined);
  const [openCreateGameType, setOpenCreateGameType] = useState<boolean>(false);
  const [openEditGameType, setOpenEditGameType] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<string>("games");
  const [isFetchInitiated, setIsFetchInitiated] = useState(false);

  useEffect(() => {
    if (!isFetchInitiated) {
      toggleFetch("games");
      toggleFetch("gameTypes");
      setIsFetchInitiated(true);
    }
  }, [isFetchInitiated, toggleFetch]);

  const handleEditOpen = (game: Game) => {
    setSelectedGame(game);
    setOpenEditGame(true);
  };

  const handleEditOpenType = (gametype: GameType) => {
    setSelectedGameType(gametype);
    setOpenEditGameType(true);
  };

  const handleDeleteGame = (game: Game) => {
    deleteGame(game, () => {
      toggleFetch("games");
      if (selectedGame && selectedGame.gameId === game.gameId) {
        setSelectedGame(undefined);
        setOpenEditGame(false);
      }
    });
  };

  const handleDeleteGameType = (gametype: GameType) => {
    deleteGameType(gametype, () => {
      toggleFetch("gameTypes");
      if (
        selectedGameType &&
        selectedGameType.gameTypeId === gametype.gameTypeId
      ) {
        setSelectedGameType(undefined);
        setOpenEditGameType(false);
      }
    });
  };

  return (
    <div className="space-y-5 items-center">
      <CreateGameModal
        isOpen={openCreateGame}
        onClose={() => setOpenCreateGame(false)}
      />

      {selectedGame && (
        <EditGameModal
          gameData={selectedGame}
          isOpen={openEditGame}
          onClose={() => {
            setOpenEditGame(false);
            setSelectedGame(undefined);
          }}
        />
      )}

      <CreateGameTypeModal
        isOpen={openCreateGameType}
        onClose={() => setOpenCreateGameType(false)}
      />

      {selectedGameType && (
        <EditGameTypeModal
          gameTypeData={selectedGameType}
          isOpen={openEditGameType}
          onClose={() => {
            setOpenEditGameType(false);
            setSelectedGameType(undefined);
          }}
        />
      )}

      <div className="flex flex-row justify-between items-center">
        {activeTab === "games" && (
          <Heading title={`${t("sidebar.product.games")} (${games.length})`} />
        )}
        {activeTab === "game_types" && (
          <Heading
            title={`${t("sidebar.product.game_types")} (${gameTypes.length})`}
          />
        )}
        <ButtonWithIcon
          onClick={() =>
            activeTab === "games"
              ? setOpenCreateGame(true)
              : setOpenCreateGameType(true)
          }
          icon={PlusIcon}
        >
          {t("button.create_new")}
        </ButtonWithIcon>
      </div>

      <Tabs
        defaultValue="games"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="games">{t("sidebar.product.games")}</TabsTrigger>
          <TabsTrigger value="game_types">
            {t("sidebar.product.game_types")}
          </TabsTrigger>
        </TabsList>

        <Separator />

        <TabsContent value="games" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <Card key={game.gameId}>
                <CardHeader className="flex justify-between items-center p-4">
                  <CardTitle>{game.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p>
                    <strong>{t("form.label.color")}:</strong>{" "}
                    <span style={{ color: game.color }}>{game.color}</span>
                  </p>
                  <div className="flex space-x-2 mt-4">
                    <ButtonWithIcon
                      icon={PencilIcon}
                      onClick={() => handleEditOpen(game)}
                    >
                      {t("button.edit")}
                    </ButtonWithIcon>
                    <ButtonWithIcon
                      icon={MinusIcon}
                      onClick={() => handleDeleteGame(game)}
                    >
                      {t("button.delete")}
                    </ButtonWithIcon>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="game_types" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameTypes.map((gametype) => (
              <Card key={gametype.gameTypeId}>
                <CardHeader className="flex justify-between items-center p-4">
                  <CardTitle>{gametype.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p>
                    <strong>{t("form.label.color")}:</strong>{" "}
                    <span style={{ color: gametype.color }}>
                      {gametype.color}
                    </span>
                  </p>
                  <div className="flex space-x-2 mt-4">
                    <ButtonWithIcon
                      icon={PencilIcon}
                      onClick={() => handleEditOpenType(gametype)}
                    >
                      {t("button.edit")}
                    </ButtonWithIcon>
                    <ButtonWithIcon
                      icon={MinusIcon}
                      onClick={() => handleDeleteGameType(gametype)}
                    >
                      {t("button.delete")}
                    </ButtonWithIcon>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
