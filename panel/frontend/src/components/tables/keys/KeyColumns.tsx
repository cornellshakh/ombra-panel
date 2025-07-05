import { useFetchContext } from "@/api/FetchProvider";
import { Key } from "@/lib/schema";
import DataTableColumnHeader from "@@/tables/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import CheckboxColumn from "../columns/CheckboxColumn";
import CopyTextColumn from "../columns/CopyTextColumn";
import DateColumn from "../columns/DateColumn";
import HoverUserCardColumn from "../columns/HoverUserCardColumn";
import RectangleTextColumn from "../columns/RectangleTextColumn";
import TextColumn from "../columns/TextColumn";
import KeyDataTableRowActions from "./KeyDataTableRowActions";

function customSortFn(
  rowA: { getValue: (arg0: any) => string },
  rowB: { getValue: (arg0: any) => string },
  columnId: any
) {
  const getValue = (val: string) => (val === "-" ? 0 : parseFloat(val));

  const valA = getValue(rowA.getValue(columnId));
  const valB = getValue(rowB.getValue(columnId));

  return valA > valB ? 1 : -1;
}

function useKeyColumns(): ColumnDef<Key>[] {
  const { t } = useTranslation();
  const { settings } = useFetchContext();

  return [
    CheckboxColumn<Key>(),
    TextColumn<Key>({ accessorKey: "keyId", title: "ID" }),
    RectangleTextColumn<Key>({
      accessorKey: "gameType",
      title: t("form.label.game_type"),
    }),
    RectangleTextColumn<Key>({
      accessorKey: "game",
      title: t("form.label.game"),
    }),
    CopyTextColumn<Key>({
      accessorKey: "key",
      title: t("form.label.key"),
      t,
      customSortFn,
    }),
    HoverUserCardColumn<Key>({
      id: "createdBy",
      accessorFn: (row) => row.createdBy?.userId,
      title: "Created by",
    }),
    HoverUserCardColumn<Key>({
      id: "usedBy",
      accessorFn: (row) => row.usedBy?.userId,
      title: "Used by",
    }),
    DateColumn<Key>({
      accessorKey: "createdAt",
      title: "Created at",
      settings,
    }),
    DateColumn<Key>({
      accessorKey: "usedAt",
      title: "Used at",
      settings,
      customSortFn,
    }),
    {
      accessorKey: "isUsed",
      meta: "Used",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Used" />
      ),
      cell: ({ row }) => (row.getValue("isUsed") ? "Yes" : "No"),
    },
    {
      id: "actions",
      cell: ({ row }) => <KeyDataTableRowActions row={row} />,
    },
  ];
}

useKeyColumns.displayName = "useKeyColumns";
export default useKeyColumns;
