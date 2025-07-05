import { useFetchContext } from "@/api/FetchProvider";
import { editRole } from "@/api/roles";
import { Role, RoleSchema } from "@/lib/schema";
import ColorPickerField from "@@/forms/fields/ColorPickerField";
import InputField from "@@/forms/fields/InputField";
import { Button } from "@@/ui/button";
import { Form } from "@@/ui/form";
import { Modal } from "@@/ui/modal";
import MultipleSelector, { Option } from "@@/ui/multiple-selector";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@@/ui/form";

type EditRoleModalProps = {
  roleData: Role;
  isOpen: boolean;
  onClose: () => void;
};

function EditRoleModal({ roleData, isOpen, onClose }: EditRoleModalProps) {
  const { t } = useTranslation();
  const { toggleFetch, roles, permissions } = useFetchContext();

  const form = useForm<Role>({
    resolver: zodResolver(RoleSchema(t)),
    mode: "onBlur",
    defaultValues: roleData,
  });

  async function handleSubmit(formData: Role) {
    if (
      roles.some(
        (role: Role) =>
          role.name === formData.name && role.roleId !== formData.roleId
      )
    ) {
      form.setError("name", {
        message: t("form.error.exists.role_name"),
      });
      return;
    }

    if (
      roles.some(
        (role: Role) =>
          role.color === formData.color && role.roleId !== formData.roleId
      )
    ) {
      form.setError("color", {
        message: t("form.error.exists.role_color"),
      });
      return;
    }

    await editRole(
      roleData,
      formData,
      () => {
        toggleFetch("roles");
      },
      onClose
    );
  }

  useEffect(() => {
    form.reset(roleData);
  }, [form, roleData]);

  return (
    <Modal
      title={t("form.role.edit.title")}
      description={t("form.role.edit.description")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <InputField
            name="name"
            label={t("form.label.name")}
            placeholder={t("form.placeholder.role_name")}
          />

          <InputField
            name="description"
            label={t("form.label.description")}
            placeholder={t("form.placeholder.role_description")}
          />

          <ColorPickerField name="color" label={t("form.label.color")} />

          {/* Permissions Selector */}
          <FormField
            control={form.control}
            name="permissions"
            render={({ field }) => {
              const permissionOptions = permissions.map((permission) => ({
                label: permission.name,
                value: permission.name,
              }));

              const handlePermissionChange = (selected: Option[]) => {
                const selectedPermissions = selected
                  .map((option) =>
                    permissions.find(
                      (permission) => permission.name === option.value
                    )
                  )
                  .filter((permission) => permission);
                field.onChange(selectedPermissions);
              };

              const existingPermissionOptions =
                field.value?.map((permission) => ({
                  label: permission.name,
                  value: permission.name,
                })) ?? [];

              const extendedPermissionOptions = [
                ...permissionOptions,
                ...existingPermissionOptions.filter(
                  (permissionOption) =>
                    !permissionOptions.some(
                      (option) => option.value === permissionOption.value
                    )
                ),
              ];

              const defaultPermissionOptions = extendedPermissionOptions.filter(
                (option) =>
                  field.value?.some(
                    (permission) => permission.name === option.value
                  )
              );

              return (
                <FormItem>
                  <FormLabel>{t("form.label.permissions")}</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      options={extendedPermissionOptions}
                      value={defaultPermissionOptions}
                      onChange={handlePermissionChange}
                      placeholder={
                        !field.value?.length
                          ? t("form.placeholder.permission_select")
                          : ""
                      }
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          {t("form.error.empty.permissions")}
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

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

EditRoleModal.displayName = "EditRoleModal";
export default EditRoleModal;
