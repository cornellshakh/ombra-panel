import { useFetchContext } from "@/api/FetchProvider";
import { createSuspension } from "@/api/suspensions";
import {
  Suspension,
  SuspensionSchema,
  SuspensionStatusOptions,
} from "@/lib/schema";
import { getDefaultZodValues } from "@/lib/utils";
import DateRangePicker from "@@/DateRangePicker";
import { Button } from "@@/ui/button";
import { Command, CommandGroup, CommandItem } from "@@/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@@/ui/form";
import { Modal } from "@@/ui/modal";
import { Popover, PopoverContent, PopoverTrigger } from "@@/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import InputField from "../forms/fields/InputField";
import PopoverCommandField from "../forms/fields/PopoverCommandField";

interface EditSuspensionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateSuspensionModal({ isOpen, onClose }: EditSuspensionModalProps) {
  const { t } = useTranslation();
  const { toggleFetch, users } = useFetchContext();

  const form = useForm<Suspension>({
    resolver: zodResolver(SuspensionSchema),
    mode: "onChange",
    defaultValues: getDefaultZodValues(SuspensionSchema),
  });

  async function handleSubmit(formData: Suspension) {
    await createSuspension(formData, () => toggleFetch("suspensions"), onClose);
  }

  useEffect(() => {
    form.reset();
  }, [form, isOpen]);

  return (
    <Modal
      title={t("form.suspension.create.title")}
      description={t("form.suspension.create.description")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5"
          tabIndex={0}
        >
          <PopoverCommandField
            name="username"
            label={t("form.label.username")}
            placeholder={t("form.placeholder.username")}
            options={users}
            optionKey="username"
            optionValue="username"
          />

          <InputField
            name="reason"
            label={t("form.label.reason")}
            placeholder={t("form.placeholder.reason")}
          />

          <InputField
            name="HWID"
            label={t("form.label.HWID")}
            placeholder={t("form.placeholder.HWID")}
          />

          <FormField
            control={form.control}
            name="suspension"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{t("form.label.suspension")}</FormLabel>
                  <FormControl>
                    <DateRangePicker
                      initialDateFrom={field.value?.start!}
                      initialDateTo={field.value?.end!}
                      onUpdate={(newDate) => field.onChange(newDate.range)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => {
              const [open, setOpen] = useState<boolean>(false);

              return (
                <FormItem>
                  <FormLabel>{t("form.label.status")}</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? SuspensionStatusOptions(t)[field.value]
                            : t("form.placeholder.status")}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
                        <Command className="w-full">
                          <CommandGroup>
                            {Object.entries(SuspensionStatusOptions(t)).map(
                              ([key, label]) => (
                                <CommandItem
                                  key={key}
                                  value={key}
                                  onSelect={() => {
                                    field.onChange(
                                      key === field.value ? "" : key
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  {label}
                                </CommandItem>
                              )
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

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

CreateSuspensionModal.displayName = "CreateSuspensionModal";
export default CreateSuspensionModal;
