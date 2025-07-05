import { useFetchContext } from "@/api/FetchProvider";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import useSessionColumns from "@@/tables/sessions/SessionColumns";
import SessionDataTable from "@@/tables/sessions/SessionDataTable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Sessions() {
  const { t } = useTranslation();
  const { toggleFetch, sessions } = useFetchContext();
  const columns = useSessionColumns();
  const [isFetchInitiated, setIsFetchInitiated] = useState(false);

  useEffect(() => {
    if (!isFetchInitiated) {
      toggleFetch("sessions");
      setIsFetchInitiated(true);
    }
  }, [isFetchInitiated, toggleFetch]);

  return (
    <div>
      <div className="space-y-5 items-center">
        <div className="flex flex-row justify-between">
          <Heading
            title={`${t("sidebar.customer.sessions")} (${sessions.length})`}
          />
        </div>

        <Separator />

        <SessionDataTable columns={columns} data={sessions} />
      </div>
    </div>
  );
}
