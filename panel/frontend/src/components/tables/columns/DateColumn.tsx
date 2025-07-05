import { Settings } from "@/lib/schema";
import { formatDate } from "@/lib/utils";
import DataTableColumnHeader from "@@/tables/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";

type DateColumnProps = {
  accessorKey: string;
  title: string;
  settings: Settings;
  customSortFn?: (a: any, b: any, columnId: any) => number;
};

function DateColumn<T extends object>({
  accessorKey,
  title,
  settings,
  customSortFn,
}: DateColumnProps): ColumnDef<T> {
  const columnDef: ColumnDef<T> = {
    accessorKey,
    meta: title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const keys = accessorKey.split(".");
      let rowValue: any = row.original;

      for (const key of keys) {
        if (rowValue) {
          rowValue = rowValue[key];
        } else {
          break;
        }
      }

      if (!rowValue) return "-";

      return formatDate(rowValue, settings.language, settings.date);
    },
  };

  if (customSortFn) columnDef.sortingFn = customSortFn;

  return columnDef;
}

DateColumn.displayName = "DateColumn";
export default DateColumn;
