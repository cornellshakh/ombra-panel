import DataTableColumnHeader from "@@/tables/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";

type StatusColumnProps<TStatus extends string | number | symbol> = {
  accessorKey: string;
  title: string;
  statusOptions: Record<TStatus, string>;
  statusColorMap: Record<TStatus, string>;
};

function StatusColumn<
  T extends object,
  TStatus extends string | number | symbol,
>({
  accessorKey,
  title,
  statusOptions,
  statusColorMap,
}: StatusColumnProps<TStatus>): ColumnDef<T> {
  return {
    accessorKey: accessorKey,
    meta: title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const statusKey = row.getValue(accessorKey) as TStatus;
      const statusLabel = statusOptions[statusKey];
      const dotColor = statusColorMap[statusKey];

      return (
        <div className="inline-flex justify-center items-center px-2 py-1 gap-2 border border-secondary rounded">
          <span
            className={`h-2 w-2 rounded-full`}
            style={{ backgroundColor: dotColor }}
          ></span>
          <span className="font-medium text-xs">
            {statusLabel?.toUpperCase()}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return statusOptions[row.getValue(id) as TStatus].includes(value);
    },
  };
}

StatusColumn.displayName = "StatusColumn";
export default StatusColumn;
