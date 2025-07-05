import { useFetchContext } from "@/api/FetchProvider";
import {
  Suspension,
  SuspensionStatus,
  SuspensionStatusColorMap,
  SuspensionStatusOptions,
} from "@/lib/schema";
import DataTableColumnHeader from "@@/tables/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import CheckboxColumn from "../columns/CheckboxColumn";
import CopyTextColumn from "../columns/CopyTextColumn";
import DateColumn from "../columns/DateColumn";
import HoverUserCardColumn from "../columns/HoverUserCardColumn";
import StatusColumn from "../columns/StatusColumn";
import TextColumn from "../columns/TextColumn";
import SuspensionDataTableRowActions from "./SuspensionDataTableRowActions";

const customSortFn = (
  rowA: { getValue: (arg0: any) => string },
  rowB: { getValue: (arg0: any) => string },
  columnId: any
) => {
  const getValue = (val: string) => (val === "-" ? 0 : parseFloat(val));

  const valA = getValue(rowA.getValue(columnId));
  const valB = getValue(rowB.getValue(columnId));

  return valA > valB ? 1 : -1;
};

function useSuspensionColumns(): ColumnDef<Suspension>[] {
  const { t } = useTranslation();
  const { settings } = useFetchContext();

  return [
    CheckboxColumn<Suspension>(),
    TextColumn<Suspension>({ accessorKey: "suspensionId", title: "ID" }),
    HoverUserCardColumn<Suspension>({
      id: "username",
      accessorFn: (row) => row.user.username,
      title: t("form.label.username"),
    }),
    TextColumn<Suspension>({
      accessorKey: "reason",
      title: t("form.label.reason"),
    }),
    DateColumn<Suspension>({
      accessorKey: "suspension.start",
      title: t("component.table.suspension.column.suspension_start"),
      settings,
      customSortFn,
    }),
    DateColumn<Suspension>({
      accessorKey: "suspension.end",
      title: t("component.table.suspension.column.suspension_end"),
      settings,
      customSortFn,
    }),
    CopyTextColumn<Suspension>({
      accessorKey: "HWID",
      title: t("form.label.HWID"),
      t,
      customSortFn,
    }),
    HoverUserCardColumn<Suspension>({
      id: "suspendedBy",
      accessorFn: (row) => row.suspendedBy?.userId,
      title: t("component.table.suspension.column.suspended_by"),
    }),
    StatusColumn<Suspension, SuspensionStatus>({
      accessorKey: "status",
      title: t("form.label.status"),
      statusOptions: SuspensionStatusOptions(t),
      statusColorMap: SuspensionStatusColorMap,
    }),
    {
      accessorKey: "isActive",
      meta: t("component.table.suspension.column.is_active"),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("component.table.suspension.column.is_active")}
        />
      ),
      cell: ({ row }) => {
        return row.getValue("isActive") ? "Active" : "Inactive";
      },
    },
    DateColumn<Suspension>({
      accessorKey: "lastEdit",
      title: t("component.table.column.last_edit"),
      settings,
      customSortFn,
    }),
    {
      id: "actions",
      cell: ({ row }) => <SuspensionDataTableRowActions row={row} />,
    },
  ];
}

useSuspensionColumns.displayName = "useSuspensionColumns";
export default useSuspensionColumns;
