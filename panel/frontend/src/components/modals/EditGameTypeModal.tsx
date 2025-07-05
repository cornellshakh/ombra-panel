import { useFetchContext } from "@/api/FetchProvider";
import { editGameType } from "@/api/gameTypes";
import { GameType, GameTypeSchema } from "@/lib/schema";
import ColorPickerField from "@@/forms/fields/ColorPickerField";
import InputField from "@@/forms/fields/InputField";
import { Button } from "@@/ui/button";
import { Form } from "@@/ui/form";
import { Modal } from "@@/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type EditGameModalProps = {
  gameTypeData: GameType;
  isOpen: boolean;
  onClose: () => void;
};

function EditGameTypeModal({
  gameTypeData,
  isOpen,
  onClose,
}: EditGameModalProps) {
  const { t } = useTranslation();
  const { toggleFetch, gameTypes } = useFetchContext();

  const form = useForm<GameType>({
    resolver: zodResolver(GameTypeSchema(t)),
    mode: "onBlur",
    defaultValues: gameTypeData,
  });

  async function handleSubmit(formData: GameType) {
    if (
      gameTypes.some(
        (gameType: GameType) =>
          gameType.name === formData.name &&
          gameType.gameTypeId !== formData.gameTypeId
      )
    ) {
      form.setError("name", {
        message: t("form.error.exists.game_name"),
      });
      return;
    }

    if (
      gameTypes.some(
        (gameType: GameType) =>
          gameType.color === formData.color &&
          gameType.gameTypeId !== formData.gameTypeId
      )
    ) {
      form.setError("color", {
        message: t("form.error.exists.game_color"),
      });
      return;
    }

    await editGameType(
      gameTypeData,
      formData,
      () => {
        toggleFetch("gameTypes");
        toggleFetch("keys");
      },
      onClose
    );
  }

  useEffect(() => {
    form.reset(gameTypeData);
  }, [form, isOpen]);

  return (
    <Modal
      title={t("form.game_type.edit.title")}
      description={t("form.game_type.edit.description")}
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
            <Button type="submit">{t("button.save_changes")}</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}

EditGameTypeModal.displayName = "EditGameTypeModal";
export default EditGameTypeModal;
