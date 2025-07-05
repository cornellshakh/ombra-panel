import DataTableColumnHeader from "@@/tables/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";

type RectangleData = {
  name: string;
  color: string;
};

type RectangleTextColumnProps = {
  accessorKey: string;
  title: string;
  customSortFn?: (a: any, b: any, columnId: any) => number;
};

function RectangleTextColumn<T extends object>({
  accessorKey,
  title,
  customSortFn,
}: RectangleTextColumnProps): ColumnDef<T> {
  const columnDef: ColumnDef<T> = {
    accessorKey,
    meta: title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const RowValue: RectangleData = row.getValue(accessorKey);

      if (!RowValue) return "-";

      return (
        <div
          style={{ backgroundColor: RowValue.color, color: "white" }}
          className="flex items-center justify-center mx-0.5 py-0.5 px-2 rounded font-medium text-xs"
        >
          {RowValue.name.toUpperCase()}
        </div>
      );
    },
  };

  if (customSortFn) columnDef.sortingFn = customSortFn;

  return columnDef;
}

RectangleTextColumn.displayName = "RectangleTextColumn";
export default RectangleTextColumn;
