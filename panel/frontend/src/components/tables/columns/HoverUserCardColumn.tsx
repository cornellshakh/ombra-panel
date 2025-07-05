import HoverUserCard from "@/components/HoverUserCard";
import DataTableColumnHeader from "@@/tables/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";

type HoverUserCardColumnProps = {
  id: string;
  accessorFn: (row: any) => number | undefined;
  title: string;
  customSortFn?: (a: any, b: any, columnId: any) => number;
};

function HoverUserCardColumn<T extends object>({
  id,
  accessorFn,
  title,
  customSortFn,
}: HoverUserCardColumnProps): ColumnDef<T> {
  const columnDef: ColumnDef<T> = {
    id,
    accessorFn,
    meta: title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const rowValue: number | undefined = accessorFn(row.original);
      return rowValue ? <HoverUserCard userId={rowValue} /> : "-";
    },
  };

  if (customSortFn) columnDef.sortingFn = customSortFn;

  return columnDef;
}

HoverUserCardColumn.displayName = "HoverUserCardColumn";
export default HoverUserCardColumn;
