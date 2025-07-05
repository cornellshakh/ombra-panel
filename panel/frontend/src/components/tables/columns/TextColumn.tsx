import DataTableColumnHeader from "@@/tables/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";

type TextColumnProps = {
  accessorKey: string;
  title: string;
  customSortFn?: (a: any, b: any, columnId: any) => number;
};

function TextColumn<T extends object>({
  accessorKey,
  title,
  customSortFn,
}: TextColumnProps): ColumnDef<T> {
  const columnDef: ColumnDef<T> = {
    accessorKey,
    meta: title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      return row.getValue(accessorKey) || "-";
    },
  };

  if (customSortFn) columnDef.sortingFn = customSortFn;

  return columnDef;
}

TextColumn.displayName = "TextColumn";
export default TextColumn;
