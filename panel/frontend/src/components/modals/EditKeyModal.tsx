import { useFetchContext } from "@/api/FetchProvider";
import { editKey } from "@/api/keys";
import { Key, KeySchema } from "@/lib/schema";
import InputField from "@@/forms/fields/InputField";
import { Button } from "@@/ui/button";
import { Form } from "@@/ui/form";
import { Modal } from "@@/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PopoverCommandField from "../forms/fields/PopoverCommandField";

type EditKeyModalProps = {
  keyData: Key;
  isOpen: boolean;
  onClose: () => void;
};

function EditKeyModal({ keyData, isOpen, onClose }: EditKeyModalProps) {
  const { t } = useTranslation();
  const { toggleFetch, games, gameTypes: gameTypes } = useFetchContext();

  const form = useForm<Key>({
    resolver: zodResolver(KeySchema(t)),
    mode: "onBlur",
    defaultValues: keyData,
  });

  useEffect(() => {
    form.reset(keyData);
  }, [form, isOpen]);

  return (
    <Modal
      title={t("form.key.edit.title")}
      description={t("form.key.edit.description")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((formData: Key) => {
            editKey(keyData, formData, () => toggleFetch("keys"), onClose);
          })}
          className="space-y-5"
        >
          <PopoverCommandField
            name="gameType"
            label={t("form.label.game_type")}
            placeholder={t("form.placeholder.game_type")}
            options={gameTypes}
            optionKey="gameTypeId"
            optionValue="name"
          />

          <PopoverCommandField
            name="game"
            label={t("form.label.game")}
            placeholder={t("form.placeholder.game")}
            options={games}
            optionKey="gameId"
            optionValue="name"
          />

          <InputField name="key" label={t("form.label.key")} />

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

EditKeyModal.displayName = "EditKeyModal";
export default EditKeyModal;
