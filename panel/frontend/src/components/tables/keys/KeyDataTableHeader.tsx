import { useFetchContext } from "@/api/FetchProvider";
import { deleteKey, editKey } from "@/api/keys";
import { Key } from "@/lib/schema";
import SearchInput from "@@/SearchInput";
import DataTableViewOptions from "@@/tables/DataTableViewOptions";
import { Button } from "@@/ui/button";
import { Command, CommandGroup, CommandItem } from "@@/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@@/ui/popover";
import { Table } from "@tanstack/react-table";
import { GamepadIcon, TrashIcon, WrenchIcon, XIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

type KeyDataTableHeaderProps<TData> = {
  table: Table<TData>;
};

export default function KeyDataTableHeader<TData>({
  table,
}: KeyDataTableHeaderProps<TData>) {
  const { t } = useTranslation();

  const { toggleFetch, games, gameTypes: gameTypes } = useFetchContext();
  const isFiltered = table.getState().columnFilters.length > 0;
  const rowsSelected = table.getSelectedRowModel().rows.length > 0;
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [roleOpen, setRoleOpen] = useState<boolean>(false);
  const [gameOpen, setGameOpen] = useState<boolean>(false);
  const [isChangeRolePending, startChangeRolePending] = useTransition();

  const handleChange = (value: string) => {
    table.setGlobalFilter(value);
  };

  const clearInput = () => {
    table.setGlobalFilter("");
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SearchInput
            placeholder={t("form.placeholder.search.keys")}
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
              <XIcon className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          {rowsSelected && (
            <Popover open={roleOpen} onOpenChange={setRoleOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  size="sm"
                  className="w-full justify-between"
                >
                  <WrenchIcon className="mr-2 size-4" aria-hidden="true" />
                  {t("component.table.key.header.set_role")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
                <Command className="w-full">
                  <CommandGroup>
                    {gameTypes.map((gameType) => (
                      <CommandItem
                        key={gameType.name}
                        value={gameType.name}
                        onSelect={() => {
                          startChangeRolePending(() => {
                            table.getSelectedRowModel().rows.map((row) => {
                              let newKey = JSON.parse(
                                JSON.stringify(row.original)
                              ) as Key;
                              newKey.gameType = gameType;

                              editKey(row.original as Key, newKey, () =>
                                toggleFetch("keys")
                              );
                              setRoleOpen(false);
                            });
                            table.toggleAllPageRowsSelected(false);
                          });
                        }}
                        disabled={isChangeRolePending}
                      >
                        {gameType.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {rowsSelected && (
            <Popover open={gameOpen} onOpenChange={setGameOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  size="sm"
                  className="w-full justify-between"
                >
                  <GamepadIcon className="mr-2 size-4" aria-hidden="true" />
                  {t("component.table.key.header.set_game")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
                <Command className="w-full">
                  <CommandGroup>
                    {games.map((game) => (
                      <CommandItem
                        key={game.name}
                        value={game.name}
                        onSelect={() => {
                          startChangeRolePending(() => {
                            table.getSelectedRowModel().rows.map((row) => {
                              let newKey = JSON.parse(
                                JSON.stringify(row.original)
                              ) as Key;
                              newKey.game = game;

                              editKey(row.original as Key, newKey, () =>
                                toggleFetch("keys")
                              );
                              setGameOpen(false);
                            });
                            table.toggleAllPageRowsSelected(false);
                          });
                        }}
                        disabled={isChangeRolePending}
                      >
                        {game.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {rowsSelected && (
            <Button
              aria-label="Delete selected rows"
              variant="outline"
              size="sm"
              className="hover:bg-banned"
              onClick={() => {
                startDeleteTransition(() => {
                  table
                    .getSelectedRowModel()
                    .rows.map((row) =>
                      deleteKey(row.original as Key, () => toggleFetch("keys"))
                    );
                  table.toggleAllPageRowsSelected(false);
                });
              }}
              disabled={isDeletePending}
            >
              <TrashIcon className="mr-2 size-4" aria-hidden="true" />
              {t("button.delete")}
            </Button>
          )}

          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
