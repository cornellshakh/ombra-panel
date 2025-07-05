import { useAuthContext } from "@/api/auth/AuthProvider";
import { useFetchContext } from "@/api/FetchProvider";
import { deleteSuspension, updateSuspensionStatus } from "@/api/suspensions";
import {
  Suspension,
  SuspensionSchema,
  SuspensionStatusOptions,
} from "@/lib/schema";
import ButtonWithIcon from "@@/ButtonWithIcon";
import SearchInput from "@@/SearchInput";
import DataTableFacetedFilter from "@@/tables/DataTableFacetedFilter";
import DataTableViewOptions from "@@/tables/DataTableViewOptions";
import { Button } from "@@/ui/button";
import { Command, CommandGroup, CommandItem } from "@@/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@@/ui/popover";
import { Table } from "@tanstack/react-table";
import { InfoIcon, TrashIcon, XIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

interface SuspensionDataTableHeaderProps<TData> {
  table: Table<TData>;
}

export default function SuspensionDataTableHeader<TData>({
  table,
}: SuspensionDataTableHeaderProps<TData>) {
  const { t } = useTranslation();
  const { toggleFetch } = useFetchContext();
  const { user } = useAuthContext();

  const isFiltered = table.getState().columnFilters.length > 0;
  const rowsSelected = table.getSelectedRowModel().rows.length > 0;
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [isSetStatusPending, startSetStatusPending] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  // Calculate the count of each status
  const statusCounts = Object.entries(SuspensionStatusOptions).map(
    ([key, label]) => ({
      label: label,
      value: key,
      count: table
        .getPreFilteredRowModel()
        .rows.filter((row: any) => row.getValue("status") === key).length,
    })
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <SearchInput
          placeholder={t("form.placeholder.search.suspensions")}
          onChange={(value) => table.setGlobalFilter(value)}
          onClear={() => table.setGlobalFilter("")}
        />

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title={t("form.label.status")}
            options={statusCounts}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="px-2 lg:px-3"
          >
            {t("button.reset")}
            <XIcon className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        {rowsSelected && (
          <Popover open={statusOpen} onOpenChange={setStatusOpen}>
            <PopoverTrigger asChild>
              <ButtonWithIcon
                variant="outline"
                role="combobox"
                size="sm"
                icon={InfoIcon}
              >
                {t("component.table.suspension.header.set_status")}
              </ButtonWithIcon>
            </PopoverTrigger>
            <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
              <Command className="w-full">
                <CommandGroup>
                  {Object.entries(SuspensionStatusOptions).map(
                    ([key, label]) => (
                      <CommandItem
                        key={key}
                        value={key}
                        onSelect={() => {
                          startSetStatusPending(() => {
                            table.getSelectedRowModel().rows.map((row) => {
                              updateSuspensionStatus(
                                row.original as Suspension,
                                user?.userId,
                                key,
                                () => toggleFetch("suspensions")
                              );
                            });
                            table.toggleAllPageRowsSelected(false);
                          });
                        }}
                        disabled={isSetStatusPending}
                      >
                        {label.charAt(0).toUpperCase() + label.slice(1)}
                      </CommandItem>
                    )
                  )}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        {rowsSelected && (
          <ButtonWithIcon
            aria-label="Delete selected rows"
            variant="outline"
            size="sm"
            icon={TrashIcon}
            onClick={() => {
              startDeleteTransition(() => {
                table.getSelectedRowModel().rows.map((row) => {
                  const row_data = SuspensionSchema.parse(row.original);
                  deleteSuspension(row_data, () => toggleFetch("suspensions"));
                });
                table.toggleAllPageRowsSelected(false);
              });
            }}
            disabled={isDeletePending}
          >
            {t("button.delete")}
          </ButtonWithIcon>
        )}

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
