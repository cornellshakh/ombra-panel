import { useAuthContext } from "@/api/auth/AuthProvider";
import { useFetchContext } from "@/api/FetchProvider";
import { createKey } from "@/api/keys";
import { Key, KeySchema } from "@/lib/schema";
import { getDefaultZodValues } from "@/lib/utils";
import PopoverCommandField from "@@/forms/fields/PopoverCommandField";
import { Button } from "@@/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@@/ui/form";
import { Input } from "@@/ui/input";
import { Modal } from "@@/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type CreateKeyModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function CreateKeyModal({ isOpen, onClose }: CreateKeyModalProps) {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const { toggleFetch, gameTypes, games } = useFetchContext();

  const [numKeys, setNumKeys] = useState<number>(1);

  const form = useForm<Key>({
    resolver: zodResolver(KeySchema(t)),
    mode: "onBlur",
    defaultValues: getDefaultZodValues(KeySchema(t)),
  });

  async function handleSubmit(formData: Key) {
    await createKey(
      formData,
      numKeys,
      user!,
      () => toggleFetch("keys"),
      onClose
    );
  }

  useEffect(() => {
    form.reset();
  }, [form, isOpen]);

  return (
    <Modal
      title={t("form.key.create.title")}
      description={t("form.key.create.description")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
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

          <FormItem>
            <FormLabel>{t("form.label.number_of_keys")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                value={numKeys.toString()}
                onChange={(e) => setNumKeys(parseInt(e.target.value) || 1)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>

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

CreateKeyModal.displayName = "CreateKeyModal";
export default CreateKeyModal;
