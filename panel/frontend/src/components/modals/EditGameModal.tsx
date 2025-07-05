import { useFetchContext } from "@/api/FetchProvider";
import { editGame } from "@/api/games";
import { Game, GameSchema } from "@/lib/schema";
import ColorPickerField from "@@/forms/fields/ColorPickerField";
import InputField from "@@/forms/fields/InputField";
import { Button } from "@@/ui/button";
import { Form } from "@@/ui/form";
import { Modal } from "@@/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PopoverCommandField from "../forms/fields/PopoverCommandField";

type EditGameModalProps = {
  gameData: Game;
  isOpen: boolean;
  onClose: () => void;
};

function EditGameModal({ gameData, isOpen, onClose }: EditGameModalProps) {
  const { t } = useTranslation();
  const { toggleFetch, games, gameTypes: gameTypes } = useFetchContext();

  const form = useForm<Game>({
    resolver: zodResolver(GameSchema(t)),
    mode: "onBlur",
    defaultValues: gameData,
  });

  async function handleSubmit(formData: Game) {
    if (
      games.some(
        (game: Game) =>
          game.name === formData.name && game.gameId !== formData.gameId
      )
    ) {
      form.setError("name", {
        message: t("form.error.exists.game_name"),
      });
      return;
    }

    if (
      games.some(
        (game: Game) =>
          game.color === formData.color && game.gameId !== formData.gameId
      )
    ) {
      form.setError("color", {
        message: t("form.error.exists.game_color"),
      });
      return;
    }

    await editGame(
      gameData,
      formData,
      () => {
        toggleFetch("games");
        toggleFetch("keys");
      },
      onClose
    );
  }

  useEffect(() => {
    form.reset(gameData);
  }, [form, isOpen]);

  return (
    <Modal
      title={t("form.game.edit.title")}
      description={t("form.game.edit.description")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <InputField
            name="name"
            label={t("form.label.name")}
            placeholder={t("form.placeholder.game_name")}
          />

          <PopoverCommandField
            name="gameType"
            label={t("form.label.game_type")}
            placeholder={t("form.placeholder.game_type")}
            options={gameTypes}
            optionKey="gameTypeId"
            optionValue="name"
          />

          <ColorPickerField name="color" label={t("form.label.color")} />

          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={onClose}>
              {t("button.cancel")}
            </Button>
            <Button type="submit">{t("button.save_changes")}</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}

EditGameModal.displayName = "EditGameModal";
export default EditGameModal;
