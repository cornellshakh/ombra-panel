import { useFetchContext } from "@/api/FetchProvider";
import { deletePermission } from "@/api/permissions";
import { deleteRole } from "@/api/roles";
import { Permission, Role } from "@/lib/schema";
import ButtonWithIcon from "@@/ButtonWithIcon";
import CreatePermissionModal from "@@/modals/CreatePermissionModal";
import CreateRoleModal from "@@/modals/CreateRoleModal";
import EditPermissionModal from "@@/modals/EditPermissionModal";
import EditRoleModal from "@@/modals/EditRoleModal";
import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";
import { Heading } from "@@/ui/heading";
import { Separator } from "@@/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@@/ui/tabs";
import { MinusIcon, PencilIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Roles() {
  const { t } = useTranslation();
  const { toggleFetch, roles, permissions } = useFetchContext();

  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const [openCreateRole, setOpenCreateRole] = useState<boolean>(false);
  const [openEditRole, setOpenEditRole] = useState<boolean>(false);

  const [selectedPermission, setSelectedPermission] = useState<
    Permission | undefined
  >(undefined);
  const [openCreatePermission, setOpenCreatePermission] =
    useState<boolean>(false);
  const [openEditPermission, setOpenEditPermission] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<string>("roles");
  const [isFetchInitiated, setIsFetchInitiated] = useState(false);

  useEffect(() => {
    if (!isFetchInitiated) {
      toggleFetch("roles");
      toggleFetch("permissions");
      setIsFetchInitiated(true);
    }
  }, [isFetchInitiated, toggleFetch]);

  const handleEditOpenRole = (role: Role) => {
    setSelectedRole(role);
    setOpenEditRole(true);
  };

  const handleEditOpenPermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setOpenEditPermission(true);
  };

  const handleDeleteRole = (role: Role) => {
    deleteRole(role, () => {
      toggleFetch("roles");
      if (selectedRole && selectedRole.roleId === role.roleId) {
        setSelectedRole(undefined);
        setOpenEditRole(false);
      }
    });
  };

  const handleDeletePermission = (permission: Permission) => {
    deletePermission(permission, () => {
      toggleFetch("permissions");
      if (
        selectedPermission &&
        selectedPermission.permissionId === permission.permissionId
      ) {
        setSelectedPermission(undefined);
        setOpenEditPermission(false);
      }
    });
  };

  return (
    <div className="space-y-5 items-center">
      <CreateRoleModal
        isOpen={openCreateRole}
        onClose={() => setOpenCreateRole(false)}
      />

      {selectedRole && (
        <EditRoleModal
          roleData={selectedRole}
          isOpen={openEditRole}
          onClose={() => {
            setOpenEditRole(false);
            setSelectedRole(undefined);
          }}
        />
      )}

      <CreatePermissionModal
        isOpen={openCreatePermission}
        onClose={() => setOpenCreatePermission(false)}
      />

      {selectedPermission && (
        <EditPermissionModal
          permissionData={selectedPermission}
          isOpen={openEditPermission}
          onClose={() => {
            setOpenEditPermission(false);
            setSelectedPermission(undefined);
          }}
        />
      )}

      <div className="flex flex-row justify-between items-center">
        {activeTab === "roles" && (
          <Heading title={`${t("sidebar.customer.roles")} (${roles.length})`} />
        )}
        {activeTab === "permissions" && (
          <Heading
            title={`${t("sidebar.customer.permissions")} (${permissions.length})`}
          />
        )}
        <ButtonWithIcon
          onClick={() =>
            activeTab === "roles"
              ? setOpenCreateRole(true)
              : setOpenCreatePermission(true)
          }
          icon={PlusIcon}
        >
          {t("button.create_new")}
        </ButtonWithIcon>
      </div>

      <Tabs
        defaultValue="roles"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="roles">{t("sidebar.customer.roles")}</TabsTrigger>
          <TabsTrigger value="permissions">
            {t("sidebar.customer.permissions")}
          </TabsTrigger>
        </TabsList>

        <Separator />

        <TabsContent value="roles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card key={role.roleId}>
                <CardHeader className="flex justify-between items-center p-4">
                  <CardTitle>{role.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="font-bold">
                    {t("form.label.description")}:{" "}
                    <span className="font-normal">{role.description}</span>
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="font-bold">{t("form.label.color")}:</p>
                    <div
                      style={{ backgroundColor: role.color }}
                      className="w-6 h-6 border border-gray-200 rounded-full"
                    ></div>
                  </div>

                  <div className="mt-4">
                    <p className="font-bold">{t("form.label.permissions")}:</p>
                    {role.permissions.length > 0 ? (
                      <ul className="list-disc ml-4">
                        {role.permissions.map((permission) => (
                          <li key={permission.permissionId}>
                            {permission.name.replace(/_/g, " ")}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{t("message.no_permissions")}</p>
                    )}
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <ButtonWithIcon
                      icon={PencilIcon}
                      onClick={() => handleEditOpenRole(role)}
                    >
                      {t("button.edit")}
                    </ButtonWithIcon>
                    <ButtonWithIcon
                      icon={MinusIcon}
                      onClick={() => handleDeleteRole(role)}
                    >
                      {t("button.delete")}
                    </ButtonWithIcon>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {permissions.map((permission) => (
              <Card key={permission.permissionId}>
                <CardHeader className="flex justify-between items-center p-4">
                  <CardTitle>{permission.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="font-bold">
                    {t("form.label.description")}:{" "}
                    <span className="font-normal">
                      {permission.description}
                    </span>
                  </p>
                  <div className="flex space-x-2 mt-4">
                    <ButtonWithIcon
                      icon={PencilIcon}
                      onClick={() => handleEditOpenPermission(permission)}
                    >
                      {t("button.edit")}
                    </ButtonWithIcon>
                    <ButtonWithIcon
                      icon={MinusIcon}
                      onClick={() => handleDeletePermission(permission)}
                    >
                      {t("button.delete")}
                    </ButtonWithIcon>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
