import { copyToClipboard } from "@/lib/utils";
import DataTableColumnHeader from "@@/tables/DataTableColumnHeader";
import { Button } from "@@/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@@/ui/tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { CopyIcon } from "lucide-react";

type CopyTextColumnProps = {
  accessorKey: string;
  title: string;
  t: (arg: string) => string;
  customSortFn?: (a: any, b: any, columnId: any) => number;
};

function CopyTextColumn<T extends object>({
  accessorKey,
  title,
  t,
  customSortFn,
}: CopyTextColumnProps): ColumnDef<T> {
  const columnDef: ColumnDef<T> = {
    accessorKey,
    meta: title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const rowValue: string = row.getValue(accessorKey);

      if (!rowValue) return "-";

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-[100px] truncate whitespace-nowrap overflow-hidden">
              {rowValue}
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            align="center"
            className="flex items-center"
          >
            {rowValue}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 ml-2"
              onClick={() => copyToClipboard(title, rowValue, t)}
            >
              <CopyIcon size={16} />
            </Button>
          </TooltipContent>
        </Tooltip>
      );
    },
  };

  if (customSortFn) columnDef.sortingFn = customSortFn;

  return columnDef;
}

CopyTextColumn.displayName = "CopyTextColumn";
export default CopyTextColumn;
