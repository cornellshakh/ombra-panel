import { Button } from "@@/ui/button";
import { Table } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
};

export default function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end space-x-2">
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {t("component.table.previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {t("component.table.next")}
        </Button>
      </div>
    </div>
  );
}
