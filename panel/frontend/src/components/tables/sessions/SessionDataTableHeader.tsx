import SearchInput from "@@/SearchInput";
import DataTableViewOptions from "@@/tables/DataTableViewOptions";
import { Button } from "@@/ui/button";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

type SessionDataTableHeaderProps<TData> = {
  table: Table<TData>;
};

export default function SessionDataTableHeader<TData>({
  table,
}: SessionDataTableHeaderProps<TData>) {
  const { t } = useTranslation();
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleChange = (value: string) => {
    table.setGlobalFilter(value);
  };

  const clearInput = () => {
    table.setGlobalFilter("");
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <SearchInput
          placeholder={t("form.placeholder.search.sessions") + ".."}
          onChange={handleChange}
          onClear={clearInput}
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="px-2 lg:px-3"
          >
            {t("button.reset")}
            <X className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>

      <DataTableViewOptions table={table} />
    </div>
  );
}
