import { useFetchContext } from "@/api/FetchProvider";
import { createGame } from "@/api/games";
import { Game, GameSchema } from "@/lib/schema";
import { getDefaultZodValues } from "@/lib/utils";
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

type CreateGameModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function CreateGameModal({ isOpen, onClose }: CreateGameModalProps) {
  const { t } = useTranslation();
  const { toggleFetch, games, gameTypes } = useFetchContext();

  const form = useForm<Game>({
    resolver: zodResolver(GameSchema(t)),
    mode: "onBlur",
    defaultValues: getDefaultZodValues(GameSchema(t)),
  });

  async function handleSubmit(formData: Game) {
    if (games.some((game: Game) => game.name === formData.name)) {
      form.setError("name", {
        message: t("form.error.exists.game_name"),
      });
      return;
    }

    if (games.some((game: Game) => game.color === formData.color)) {
      form.setError("color", {
        message: t("form_errors.exists.game_color"),
      });
      return;
    }

    await createGame(formData, () => toggleFetch("games"), onClose);
  }

  useEffect(() => {
    form.reset();
  }, [form, isOpen]);

  return (
    <Modal
      title={t("form.game.create.title")}
      description={t("form.game.create.description")}
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
            <Button variant="ghost" type="button" onClick={onClose}>
              {t("button.cancel")}
            </Button>
            <Button type="submit">{t("button.create")}</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}

CreateGameModal.displayName = "CreateGameModal";
export default CreateGameModal;
