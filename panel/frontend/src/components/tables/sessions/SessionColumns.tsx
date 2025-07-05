import { useFetchContext } from "@/api/FetchProvider";
import { Session } from "@/lib/schema";
import CheckboxColumn from "@@/tables/columns/CheckboxColumn";
import TextColumn from "@@/tables/columns/TextColumn";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import DateColumn from "../columns/DateColumn";

function useSessionColumns(): ColumnDef<Session>[] {
  const { t } = useTranslation();
  const { settings } = useFetchContext();

  return [
    CheckboxColumn<Session>(),
    TextColumn<Session>({ accessorKey: "sessionId", title: "ID" }),
    TextColumn<Session>({
      accessorKey: "user.username",
      title: t("form.label.username"),
    }),
    // StatusColumn<Session, SessionStatus>({
    //   accessorKey: "status",
    //   title: t("component.table.session.column.status"),
    //   statusOptions: SessionStatusOptions(t),
    //   statusColorMap: {},
    // }),
    TextColumn<Session>({
      accessorKey: "game.gameId",
      title: t("form.label.game_id"),
    }),
    DateColumn<Session>({
      accessorKey: "createdAt",
      title: t("component.table.column.created_at"),
      settings,
    }),
  ];
}

useSessionColumns.displayName = "useSessionColumns";
export default useSessionColumns;
