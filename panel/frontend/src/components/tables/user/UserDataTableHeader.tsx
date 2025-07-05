import { useAuthContext } from "@/api/auth/AuthProvider";
import { useFetchContext } from "@/api/FetchProvider";
import { deleteUser, editUser, updateUserStatus } from "@/api/users";
import { User, UserSchema, UserStatusOptions } from "@/lib/schema";
import ButtonWithIcon from "@@/ButtonWithIcon";
import SearchInput from "@@/SearchInput";
import DataTableFacetedFilter from "@@/tables/DataTableFacetedFilter";
import DataTableViewOptions from "@@/tables/DataTableViewOptions";
import { Button } from "@@/ui/button";
import { Command, CommandGroup, CommandItem } from "@@/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@@/ui/popover";
import { Table } from "@tanstack/react-table";
import {
  Gamepad2Icon,
  InfoIcon,
  TrashIcon,
  WrenchIcon,
  XIcon,
} from "lucide-react";
import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type UserDataTableHeaderProps<TData> = {
  table: Table<TData>;
};

export default function UserDataTableHeader<TData>({
  table,
}: UserDataTableHeaderProps<TData>) {
  const { t } = useTranslation();
  const { toggleFetch, roles, games } = useFetchContext();
  const { user } = useAuthContext();

  const isFiltered = table.getState().columnFilters.length > 0;
  const rowsSelected = table.getSelectedRowModel().rows.length > 0;
  const [roleOpen, setRoleOpen] = useState<boolean>(false);
  const [isChangeRolePending, startChangeRolePending] = useTransition();
  const [gameOpen, setGameOpen] = useState<boolean>(false);
  const [isChangeGamePending, startChangeGamePending] = useTransition();
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [isSetStatusPending, startSetStatusPending] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const statusCount = Object.entries(UserStatusOptions(t)).map(
    ([key, label]) => ({
      label: label,
      value: key,
      count: table
        .getPreFilteredRowModel()
        .rows.filter((row: any) => row.getValue("status") === key).length,
    })
  );

  const roleCount = roles.map((role) => ({
    label: role.name,
    value: role.name,
    count: table
      .getPreFilteredRowModel()
      .rows.filter((row: any) =>
        row.getValue("roles").some((r: any) => r.name === role.name)
      ).length,
  }));

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <SearchInput
          placeholder={t("form.placeholder.search.users")}
          onChange={(value) => table.setGlobalFilter(value)}
          onClear={() => table.setGlobalFilter("")}
        />

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title={t("form.label.status")}
            options={statusCount}
          />
        )}

        {table.getColumn("roles") && (
          <DataTableFacetedFilter
            column={table.getColumn("roles")}
            title={t("component.table.user.column.roles")}
            options={roleCount}
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
          <Popover open={roleOpen} onOpenChange={setRoleOpen}>
            <PopoverTrigger asChild>
              <ButtonWithIcon
                variant="outline"
                size="sm"
                role="combobox"
                icon={WrenchIcon}
              >
                {t("component.table.user.header.add_role")}
              </ButtonWithIcon>
            </PopoverTrigger>
            <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
              <Command className="w-full">
                <CommandGroup>
                  {roles.map((role) => (
                    <CommandItem
                      key={role.name}
                      value={role.name}
                      onSelect={() => {
                        startChangeRolePending(() => {
                          table.getSelectedRowModel().rows.map((row) => {
                            let newUser = JSON.parse(
                              JSON.stringify(row.original)
                            ) as User;
                            newUser.roles = [...(newUser.roles ?? []), role];

                            editUser(row.original as User, newUser, () =>
                              toggleFetch("users")
                            );
                            setRoleOpen(false);
                          });
                          table.toggleAllPageRowsSelected(false);
                        });
                      }}
                      disabled={isChangeRolePending}
                    >
                      {role.name}
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
              <ButtonWithIcon
                variant="outline"
                role="combobox"
                size="sm"
                icon={Gamepad2Icon}
              >
                {t("component.table.user.header.add_game")}
              </ButtonWithIcon>
            </PopoverTrigger>
            <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
              <Command className="w-full">
                <CommandGroup>
                  {games.map((game) => (
                    <CommandItem
                      key={game.name}
                      value={game.name}
                      onSelect={() => {
                        startChangeGamePending(() => {
                          table.getSelectedRowModel().rows.map((row) => {
                            let newUser = JSON.parse(
                              JSON.stringify(row.original)
                            ) as User;
                            newUser.games = [...(newUser.games ?? []), game];

                            editUser(row.original as User, newUser, () =>
                              toggleFetch("users")
                            );
                            setGameOpen(false);
                          });
                          table.toggleAllPageRowsSelected(false);
                        });
                      }}
                      disabled={isChangeGamePending}
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
          <Popover open={statusOpen} onOpenChange={setStatusOpen}>
            <PopoverTrigger asChild>
              <ButtonWithIcon
                variant="outline"
                role="combobox"
                size="sm"
                icon={InfoIcon}
              >
                {t("component.table.user.header.set_status")}
              </ButtonWithIcon>
            </PopoverTrigger>
            <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
              <Command className="w-full">
                <CommandGroup>
                  {Object.entries(UserStatusOptions(t)).map(([key, label]) => (
                    <CommandItem
                      key={key}
                      value={key}
                      onSelect={() => {
                        startSetStatusPending(() => {
                          table.getSelectedRowModel().rows.map((row) => {
                            updateUserStatus(
                              row.original as User,
                              user?.userId,
                              key,
                              () => toggleFetch("users")
                            );
                          });
                          table.toggleAllPageRowsSelected(false);
                        });
                      }}
                      disabled={isSetStatusPending}
                    >
                      {label.charAt(0).toUpperCase() + label.slice(1)}
                    </CommandItem>
                  ))}
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
                  const row_data = UserSchema(t).parse(row.original);
                  if (row_data.userId == user?.userId) {
                    toast.error(
                      t("component.table.user.actions.error.self_delete")
                    );
                    return;
                  }

                  deleteUser(row_data, () => toggleFetch("users"));
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
