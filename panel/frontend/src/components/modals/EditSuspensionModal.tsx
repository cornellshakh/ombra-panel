import { useFetchContext } from "@/api/FetchProvider";
import { editSuspension } from "@/api/suspensions";
import {
  Suspension,
  SuspensionSchema,
  SuspensionStatusOptions,
} from "@/lib/schema";
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
import { Input } from "../ui/input";

interface EditSuspensionModalProps {
  suspensionData: Suspension;
  isOpen: boolean;
  onClose: () => void;
}

function EditSuspensionModal({
  suspensionData,
  isOpen,
  onClose,
}: EditSuspensionModalProps) {
  const { t } = useTranslation();
  const { toggleFetch } = useFetchContext();

  const form = useForm<Suspension>({
    resolver: zodResolver(SuspensionSchema),
    mode: "onChange",
    defaultValues: suspensionData,
  });

  async function handleSubmit(formData: Suspension) {
    await editSuspension(
      suspensionData,
      formData,
      () => toggleFetch("suspensions"),
      onClose
    );
  }

  useEffect(() => {
    form.reset(suspensionData);
  }, [form, isOpen]);

  return (
    <Modal
      title={t("form.suspension.edit.title")}
      description={t("form.suspension.edit.description")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5"
          tabIndex={0}
        >
          <FormField
            control={form.control}
            name="user.userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.label.username")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
                            {Object.entries(SuspensionStatusOptions).map(
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
            <Button type="submit">{t("button.save_changes")}</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}

EditSuspensionModal.displayName = "EditSuspensionModal";
export default EditSuspensionModal;
