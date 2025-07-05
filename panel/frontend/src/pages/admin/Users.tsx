import { useFetchContext } from "@/api/FetchProvider";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import CreateSuspensionModal from "@/components/modals/CreateSuspensionModal";
import CreateUserModal from "@/components/modals/CreateUserModal";
import useUserColumns from "@/components/tables/user/UserColumns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import useSuspensionColumns from "@@/tables/suspensions/SuspensionColumns"; // Ensure you create this component
import SuspensionDataTable from "@@/tables/suspensions/SuspensionDataTable"; // Ensure you create this component
import UserDataTable from "@@/tables/user/UserDataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@@/ui/tabs";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Users() {
  const { t } = useTranslation();
  const { toggleFetch, users, suspensions } = useFetchContext();
  const userColumns = useUserColumns();
  const suspensionColumns = useSuspensionColumns();
  const [isFetchInitiated, setIsFetchInitiated] = useState(false);
  const [openCreateUser, setOpenCreateUser] = useState<boolean>(false);
  const [openCreateSuspension, setOpenCreateSuspension] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("users");

  useEffect(() => {
    if (!isFetchInitiated) {
      toggleFetch("users");
      toggleFetch("roles");
      toggleFetch("games");
      toggleFetch("suspensions");
      setIsFetchInitiated(true);
    }
  }, [isFetchInitiated, toggleFetch]);

  return (
    <div className="space-y-5 items-center">
      <CreateUserModal
        isOpen={openCreateUser}
        onClose={() => setOpenCreateUser(false)}
      />

      <CreateSuspensionModal
        isOpen={openCreateSuspension}
        onClose={() => setOpenCreateSuspension(false)}
      />

      <div className="flex flex-row justify-between items-center">
        {activeTab === "users" && (
          <Heading title={`${t("sidebar.customer.users")} (${users.length})`} />
        )}
        {activeTab === "suspensions" && (
          <Heading
            title={`${t("sidebar.customer.suspensions")} (${suspensions.length})`}
          />
        )}
        <ButtonWithIcon
          onClick={() =>
            activeTab === "users"
              ? setOpenCreateUser(true)
              : setOpenCreateSuspension(true)
          }
          icon={PlusIcon}
        >
          {t("button.create_new")}
        </ButtonWithIcon>
      </div>

      <Tabs
        defaultValue="users"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="users">{t("sidebar.customer.users")}</TabsTrigger>
          <TabsTrigger value="suspensions">
            {t("sidebar.customer.suspensions")}
          </TabsTrigger>
        </TabsList>

        <Separator />

        <TabsContent value="users" className="space-y-4">
          <UserDataTable columns={userColumns} data={users} />
        </TabsContent>

        <TabsContent value="suspensions" className="space-y-4">
          <SuspensionDataTable columns={suspensionColumns} data={suspensions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
