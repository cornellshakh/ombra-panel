import { useFetchContext } from "@/api/FetchProvider";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import CreateKeyModal from "@/components/modals/CreateKeyModal";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import useKeyColumns from "@@/tables/keys/KeyColumns";
import KeyDataTable from "@@/tables/keys/KeyDataTable";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function KeyCreationPanel() {
  const { t } = useTranslation();
  const { toggleFetch, keys } = useFetchContext();
  const columns = useKeyColumns();
  const [isFetchInitiated, setIsFetchInitiated] = useState(false);
  const [openCreateKey, setOpenCreateKey] = useState<boolean>(false);

  useEffect(() => {
    if (!isFetchInitiated) {
      toggleFetch("keys");
      toggleFetch("gameTypes");
      toggleFetch("games");
      setIsFetchInitiated(true);
    }
  }, [isFetchInitiated, toggleFetch]);

  return (
    <div>
      <CreateKeyModal
        isOpen={openCreateKey}
        onClose={() => setOpenCreateKey(false)}
      />

      <div className="space-y-5 items-center">
        <div className="flex flex-row justify-between">
          <Heading title={`${t("sidebar.product.keys")} (${keys.length})`} />

          <ButtonWithIcon
            onClick={() => setOpenCreateKey(true)}
            icon={PlusIcon}
          >
            {t("button.create_new")}
          </ButtonWithIcon>
        </div>

        <Separator />
        <KeyDataTable columns={columns} data={keys} />
      </div>
    </div>
  );
}
