import { useFetchContext } from "@/api/FetchProvider";
import { createRandomUser, createUser } from "@/api/users";
import { User, UserSchema, UserStatusOptions } from "@/lib/schema";
import { getDefaultZodValues } from "@/lib/utils";
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
import PasswordField from "../forms/fields/PasswordField";

type CreateUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const { t } = useTranslation();
  const { toggleFetch, users, roles, games } = useFetchContext();

  const form = useForm<User>({
    resolver: zodResolver(UserSchema(t)),
    mode: "onBlur",
    defaultValues: getDefaultZodValues(UserSchema(t)),
  });

  async function handleSubmit(formData: User) {
    if (users.some((user: User) => user.username === formData.username)) {
      form.setError("username", {
        message: t("form.error.exists.user_name"),
      });
      return;
    }

    if (users.some((user: User) => user.email === formData.email)) {
      form.setError("email", {
        message: t("form.error.exists.user_email"),
      });
      return;
    }

    if (
      users.some(
        (user: User) => user.HWID === formData.HWID && formData.HWID !== ""
      )
    ) {
      form.setError("HWID", {
        message: t("form.error.exists.user_HWID"),
      });
      return;
    }

    await createUser(formData, () => toggleFetch("users"), onClose);
  }

  useEffect(() => {
    form.reset();
  }, [form, isOpen]);

  useEffect(() => {
    console.log("Form Errors:", form.formState.errors);
  }, [form.formState.errors]);

  return (
    <Modal
      title={t("form.user.create.title")}
      description={t("form.user.create.description")}
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

          <PasswordField
            name="password"
            label={t("form.label.password")}
            placeholder={t("form.placeholder.password")}
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
                          start: newDate.range.from,
                          end: newDate.range.to,
                        });
                        console.log("New Date:", newDate);
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
              const gameOptions = games.map((game) => ({
                label: game.name,
                value: game.name,
              }));

              const handleGameChange = (selected: Option[]) => {
                const selectedGames = selected
                  .map((option) =>
                    games.find((game) => game.name === option.value)
                  )
                  .filter((game) => game);
                field.onChange(selectedGames);
              };

              const existingGameOptions =
                field.value?.map((game) => ({
                  label: game.name,
                  value: game.name,
                })) ?? [];

              const extendedGameOptions = [
                ...gameOptions,
                ...existingGameOptions.filter(
                  (gameOption) =>
                    !gameOptions.some(
                      (option) => option.value === gameOption.value
                    )
                ),
              ];

              const defaultGameOptions = extendedGameOptions.filter((option) =>
                field.value?.some((game) => game.name === option.value)
              );

              return (
                <FormItem>
                  <FormLabel>{t("form.label.game")}</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      options={extendedGameOptions}
                      value={defaultGameOptions}
                      onChange={handleGameChange}
                      placeholder={
                        !field.value?.length
                          ? t("form.placeholder.game_select")
                          : ""
                      }
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          {t("form.error..empty.games")}
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
              const userRoleOptions = roles.map((role) => ({
                label: role.name,
                value: role.name,
              }));

              const handleRoleChange = (selected: Option[]) => {
                const selectedRoles = selected
                  .map((option) =>
                    roles.find((role) => role.name === option.value)
                  )
                  .filter((role) => role);
                field.onChange(selectedRoles);
              };

              const existingRoleOptions =
                field.value?.map((role) => ({
                  label: role.name,
                  value: role.name,
                })) ?? [];

              const extendedRoleOptions = [
                ...userRoleOptions,
                ...existingRoleOptions.filter(
                  (roleOption) =>
                    !userRoleOptions.some(
                      (option) => option.value === roleOption.value
                    )
                ),
              ];

              const defaultRoleOptions = extendedRoleOptions.filter((option) =>
                field.value?.some((role) => role.name === option.value)
              );

              return (
                <FormItem>
                  <FormLabel>{t("form.label.role")}</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      options={extendedRoleOptions}
                      value={defaultRoleOptions}
                      onChange={handleRoleChange}
                      placeholder={
                        !field.value?.length
                          ? t("form.placeholder.role_select")
                          : ""
                      }
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          {t("form.error.empty.roles")}
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
            <Button
              variant="destructive"
              onClick={() =>
                createRandomUser(() => toggleFetch("users"), onClose)
              }
            >
              {t("form.user.create.random_button")}
            </Button>

            <div className="flex justify-end space-x-2">
              <Button variant="ghost" type="button" onClick={onClose}>
                {t("button.cancel")}
              </Button>
              <Button type="submit">{t("button.create")}</Button>
            </div>
          </div>
        </form>
      </Form>
    </Modal>
  );
}

CreateUserModal.displayName = "CreateUserModal";
export default CreateUserModal;
