import { useFetchContext } from "@/api/FetchProvider";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import useServerLogColumns from "@@/tables/logs/ServerLogColumns";
import ServerLogDataTable from "@@/tables/logs/ServerLogDataTable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LogCreationPanel() {
  const { t } = useTranslation();
  const { toggleFetch, logs } = useFetchContext();
  const columns = useServerLogColumns();
  const [isFetchInitiated, setIsFetchInitiated] = useState(false);

  useEffect(() => {
    if (!isFetchInitiated) {
      toggleFetch("logs");
      setIsFetchInitiated(true);
    }
  }, [isFetchInitiated, toggleFetch]);

  return (
    <div>
      <div className="space-y-5 items-center">
        <div className="flex flex-row justify-between">
          <Heading title={`${t("sidebar.other.logs")} (${logs.length})`} />
        </div>

        <Separator />

        <ServerLogDataTable columns={columns} data={logs} />
      </div>
    </div>
  );
}
