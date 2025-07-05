import { useFetchContext } from "@/api/FetchProvider";
import { editPermission } from "@/api/permissions";
import { Permission, PermissionSchema } from "@/lib/schema";
import InputField from "@@/forms/fields/InputField";
import { Button } from "@@/ui/button";
import { Form } from "@@/ui/form";
import { Modal } from "@@/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type EditPermissionModalProps = {
  permissionData: Permission;
  isOpen: boolean;
  onClose: () => void;
};

function EditPermissionModal({
  permissionData,
  isOpen,
  onClose,
}: EditPermissionModalProps) {
  const { t } = useTranslation();
  const { toggleFetch, permissions } = useFetchContext();

  const form = useForm<Permission>({
    resolver: zodResolver(PermissionSchema(t)),
    mode: "onBlur",
    defaultValues: permissionData,
  });

  async function handleSubmit(formData: Permission) {
    if (
      permissions.some(
        (permission: Permission) =>
          permission.name === formData.name &&
          permission.permissionId !== formData.permissionId
      )
    ) {
      form.setError("name", {
        message: t("form.error.exists.permission_name"),
      });
      return;
    }

    await editPermission(
      permissionData,
      formData,
      () => {
        toggleFetch("permissions");
        toggleFetch("keys");
      },
      onClose
    );
  }

  useEffect(() => {
    form.reset(permissionData);
  }, [form, isOpen]);

  return (
    <Modal
      title={t("form.permission.edit.title")}
      description={t("form.permission.edit.description")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <InputField
            name="name"
            label={t("form.label.name")}
            placeholder={t("form.placeholder.permission_name")}
          />

          <InputField
            name="description"
            label={t("form.label.description")}
            placeholder={t("form.placeholder.permission_description")}
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

EditPermissionModal.displayName = "EditPermissionModal";
export default EditPermissionModal;
