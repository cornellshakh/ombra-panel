import { useFetchContext } from "@/api/FetchProvider";
import { createGameType } from "@/api/gameTypes";
import { GameType, GameTypeSchema } from "@/lib/schema";
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

type CreateGameTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function CreateGameTypeModal({ isOpen, onClose }: CreateGameTypeModalProps) {
  const { t } = useTranslation();
  const { toggleFetch, gameTypes } = useFetchContext();

  const form = useForm<GameType>({
    resolver: zodResolver(GameTypeSchema(t)),
    mode: "onBlur",
    defaultValues: getDefaultZodValues(GameTypeSchema(t)),
  });

  async function handleSubmit(formData: GameType) {
    if (
      gameTypes.some((gameType: GameType) => gameType.name === formData.name)
    ) {
      form.setError("name", {
        message: t("form.error.exists.game_name"),
      });
      return;
    }

    if (
      gameTypes.some((gameType: GameType) => gameType.color === formData.color)
    ) {
      form.setError("color", {
        message: t("form_errors.exists.game_color"),
      });
      return;
    }

    await createGameType(formData, () => toggleFetch("gameTypes"), onClose);
  }

  useEffect(() => {
    form.reset();
  }, [form, isOpen]);

  return (
    <Modal
      title={t("form.game_type.create.title")}
      description={t("form.game_type.create.description")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <InputField
            name="name"
            label={t("form.label.name")}
            placeholder={t("form.placeholder.game_type_name")}
          />

          <InputField
            name="description"
            label={t("form.label.description")}
            placeholder={t("form.placeholder.description")}
          />

          <ColorPickerField name="color" label={t("form.label.color")} />

          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={onClose}>
              {t("button.cancel")}
            </Button>
            <Button type="submit">{t("button.create")}</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}

CreateGameTypeModal.displayName = "CreateGameTypeModal";
export default CreateGameTypeModal;
