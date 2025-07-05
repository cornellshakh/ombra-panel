import { useFetchContext } from "@/api/FetchProvider";
import { editUser } from "@/api/users";
import { Game, Role, User, UserSchema, UserStatusOptions } from "@/lib/schema";
import DateRangePicker from "@@/DateRangePicker";
import InputField from "@@/forms/fields/InputField";
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
import MultipleSelector, { Option } from "@@/ui/multiple-selector";
import { Popover, PopoverContent, PopoverTrigger } from "@@/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type EditUserModalProps = {
  userData: User;
  isOpen: boolean;
  onClose: () => void;
};

function EditUserModal({ userData, isOpen, onClose }: EditUserModalProps) {
  const { t } = useTranslation();
  const { toggleFetch, roles, games, users } = useFetchContext();

  const form = useForm<User>({
    resolver: zodResolver(UserSchema(t)),
    mode: "onChange",
    defaultValues: userData,
  });

  async function handleSubmit(formData: User) {
    if (
      users.some(
        (user: User) =>
          user.username === formData.username && user.userId !== formData.userId
      )
    ) {
      form.setError("username", {
        message: t("form.error.exists.user_name"),
      });
      return;
    }

    if (
      users.some(
        (user: User) =>
          user.email === formData.email && user.userId !== formData.userId
      )
    ) {
      form.setError("email", {
        message: t("form.error.exists.user_email"),
      });
      return;
    }

    if (
      users.some(
        (user: User) =>
          user.HWID === formData.HWID &&
          user.userId !== formData.userId &&
          formData.HWID !== ""
      )
    ) {
      form.setError("HWID", {
        message: t("form.error.exists.user_HWID"),
      });
      return;
    }

    await editUser(
      userData,
      formData,
      () => {
        toggleFetch("users");
        toggleFetch("suspensions");
      },
      onClose
    );
  }

  useEffect(() => {
    form.reset(userData);
  }, [form, userData]);

  return (
    <Modal
      title={t("form.user.edit.title")}
      description={t("form.user.edit.description")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5"
          tabIndex={0}
        >
          <InputField
            name="username"
            label={t("form.label.username")}
            placeholder={t("form.placeholder.username")}
          />

          <InputField
            name="email"
            label={t("form.label.email")}
            placeholder={t("form.placeholder.email")}
          />

          <InputField
            name="HWID"
            label={t("form.label.HWID")}
            placeholder={t("form.placeholder.HWID")}
          />

          <FormField
            control={form.control}
            name="subscription"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{t("form.label.subscription")}</FormLabel>
                  <FormControl>
                    <DateRangePicker
                      initialDateFrom={field.value?.start!}
                      initialDateTo={field.value?.end!}
                      onUpdate={(newDate) => {
                        field.onChange({
                          start: newDate.range.from || null,
                          end: newDate.range.to || null,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="games"
            render={({ field }) => {
              const handleGameChange = (selected: Option[]) => {
                const newGameValues = games.filter((game) =>
                  selected.some((option) => option.value === game.name)
                );
                field.onChange(newGameValues);
              };

              const userGameOptions = games.map((game: Game) => ({
                label: game.name,
                value: game.name,
              }));

              const defaultGameOptions = userGameOptions.filter((option) =>
                field.value!.some((game) => game.name === option.value)
              );

              return (
                <FormItem>
                  <FormLabel>{t("form.label.games")}</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      options={userGameOptions}
                      value={defaultGameOptions}
                      onChange={handleGameChange}
                      placeholder={
                        !field.value?.length
                          ? t("form.placeholder.game_select")
                          : ""
                      }
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          {t("form.error.empty.games")}
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="roles"
            render={({ field }) => {
              const handleRoleChange = (selected: Option[]) => {
                const newRoleValues = roles.filter((role) =>
                  selected.some((option) => option.value === role.name)
                );
                field.onChange(newRoleValues);
              };

              const userRoleOptions = roles.map((role: Role) => ({
                label: role.name,
                value: role.name,
              }));

              const defaultRoleOptions = userRoleOptions.filter((option) =>
                field.value!.some((role) => role.name === option.value)
              );

              return (
                <FormItem>
                  <FormLabel>{t("form.label.role")}</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      options={userRoleOptions}
                      value={defaultRoleOptions}
                      onChange={handleRoleChange}
                      placeholder={
                        !field.value?.length
                          ? t("form.placeholder.role_select")
                          : ""
                      }
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          {t("form.error.roles_empty")}
                        </p>
                      }
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
                            ? UserStatusOptions(t)[field.value]
                            : t("form.placeholder.status")}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
                        <Command className="w-full">
                          <CommandGroup>
                            {Object.entries(UserStatusOptions(t)).map(
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

          <div className="flex justify-between">
            <Button variant="destructive">
              {t("form.user.edit.reset_password")}
            </Button>

            <div className="flex justify-end space-x-2">
              <Button variant="ghost" type="button" onClick={onClose}>
                {t("button.cancel")}
              </Button>
              <Button type="submit">{t("button.save_changes")}</Button>
            </div>
          </div>
        </form>
      </Form>
    </Modal>
  );
}

EditUserModal.displayName = "EditUserModal";
export default EditUserModal;
