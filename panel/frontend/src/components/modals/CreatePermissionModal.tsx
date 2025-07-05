import { useFetchContext } from "@/api/FetchProvider";
import { createPermission } from "@/api/permissions";
import { Permission, PermissionSchema } from "@/lib/schema";
import { getDefaultZodValues } from "@/lib/utils";
import InputField from "@@/forms/fields/InputField";
import { Button } from "@@/ui/button";
import { Form } from "@@/ui/form";
import { Modal } from "@@/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type CreatePermissionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function CreatePermissionModal({
  isOpen,
  onClose,
}: CreatePermissionModalProps) {
  const { t } = useTranslation();
  const { toggleFetch, permissions } = useFetchContext();

  const form = useForm<Permission>({
    resolver: zodResolver(PermissionSchema(t)),
    mode: "onBlur",
    defaultValues: getDefaultZodValues(PermissionSchema(t)),
  });

  async function handleSubmit(formData: Permission) {
    if (
      permissions.some(
        (permission: Permission) => permission.name === formData.name
      )
    ) {
      form.setError("name", {
        message: t("form.error.exists.permission_name"),
      });
      return;
    }

    await createPermission(formData, () => toggleFetch("permissions"), onClose);
  }

  useEffect(() => {
    form.reset();
  }, [form, isOpen]);

  return (
    <Modal
      title={t("form.permission.create.title")}
      description={t("form.permission.create.description")}
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

CreatePermissionModal.displayName = "CreatePermissionModal";
export default CreatePermissionModal;
