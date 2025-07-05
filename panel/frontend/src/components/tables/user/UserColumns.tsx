import { useFetchContext } from "@/api/FetchProvider";
import {
  Game,
  Role,
  User,
  UserStatus,
  UserStatusColorMap,
  UserStatusOptions,
} from "@/lib/schema";
import CheckboxColumn from "@@/tables/columns/CheckboxColumn";
import CopyTextColumn from "@@/tables/columns/CopyTextColumn";
import DateColumn from "@@/tables/columns/DateColumn";
import StatusColumn from "@@/tables/columns/StatusColumn";
import TextColumn from "@@/tables/columns/TextColumn";
import DataTableColumnHeader from "@@/tables/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import UserDataTableRowActions from "./UserDataTableRowActions";

const customSortFn = (
  rowA: { getValue: (arg0: any) => string },
  rowB: { getValue: (arg0: any) => string },
  columnId: any
) => {
  const getValue = (val: string) => (val === "-" ? 0 : parseFloat(val));

  const valA = getValue(rowA.getValue(columnId));
  const valB = getValue(rowB.getValue(columnId));

  return valA > valB ? 1 : -1;
};

function useUserColumns(): ColumnDef<User>[] {
  const { t } = useTranslation();
  const { settings } = useFetchContext();

  return [
    CheckboxColumn<User>(),
    TextColumn<User>({
      accessorKey: "userId",
      title: "ID",
    }),
    CopyTextColumn<User>({
      accessorKey: "username",
      title: t("form.label.name"),
      t,
    }),
    CopyTextColumn<User>({
      accessorKey: "email",
      title: t("form.label.email"),
      t,
    }),
    DateColumn<User>({
      accessorKey: "registerDate",
      title: t("component.table.user.column.register_date"),
      settings,
    }),
    TextColumn<User>({
      accessorKey: "registerIP",
      title: t("component.table.user.column.register_IP"),
    }),
    DateColumn<User>({
      accessorKey: "subscription.start",
      title: t("component.table.user.column.subscription_start"),
      settings,
      customSortFn,
    }),
    DateColumn<User>({
      accessorKey: "subscription.end",
      title: t("component.table.user.column.subscription_end"),
      settings,
      customSortFn,
    }),
    {
      accessorKey: "timeLeft",
      meta: t("component.table.user.column.time_left"),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("component.table.user.column.time_left")}
        />
      ),
      cell: ({ row }) => {
        const subscriptionFrom = row.original.subscription?.start;
        const subscriptionTo = row.original.subscription?.end;

        const subscriptionFromValue: Date | undefined = subscriptionFrom
          ? new Date(subscriptionFrom)
          : undefined;
        const subscriptionToValue: Date | undefined = subscriptionTo
          ? new Date(subscriptionTo)
          : undefined;

        const today = new Date();
        const hasStarted = subscriptionFromValue
          ? today >= subscriptionFromValue
          : false;

        if (!subscriptionTo && hasStarted) return "∞";

        if (subscriptionToValue && hasStarted) {
          const timeDiff = subscriptionToValue.getTime() - today.getTime();

          if (timeDiff < 0) return "Expired";

          const daysLeft = Math.floor(timeDiff / (1000 * 3600 * 24));
          const hoursLeft = Math.ceil(
            (timeDiff % (1000 * 3600 * 24)) / (1000 * 3600)
          );
          const minutesLeft = Math.ceil(
            (timeDiff % (1000 * 3600)) / (1000 * 60)
          );

          if (daysLeft > 0) return `${daysLeft} days`;
          else if (daysLeft === 1) return `${daysLeft} day`;
          else if (hoursLeft > 0) return `${hoursLeft} h ${minutesLeft} min`;
          else if (minutesLeft > 0) return `${minutesLeft} min`;
        }

        return "-";
      },
      sortingFn: customSortFn,
    },
    {
      accessorKey: "games",
      meta: t("form.label.games"),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("form.label.games")} />
      ),
      cell: ({ row }) => {
        const gamesValue: Array<Game> = row.getValue("games");

        if (gamesValue.length === 0) return "-";

        return (
          <div className="flex items-center gap-1">
            {gamesValue.map((game, index) => {
              return (
                <div
                  key={index}
                  style={{ backgroundColor: game.color, color: "white" }}
                  className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-sm`}
                  title={game.name}
                >
                  {game.name.charAt(0).toUpperCase()}
                </div>
              );
            })}
          </div>
        );
      },
    },
    DateColumn<User>({
      accessorKey: "lastLogin",
      title: t("component.table.user.column.last_login"),
      settings,
      customSortFn,
    }),
    TextColumn<User>({
      accessorKey: "lastIP",
      title: t("component.table.user.column.last_IP"),
    }),
    DateColumn<User>({
      accessorKey: "lastEdit",
      title: t("component.table.column.last_edit"),
      settings,
      customSortFn,
    }),
    CopyTextColumn<User>({
      accessorKey: "HWID",
      title: t("form.label.HWID"),
      t,
    }),
    {
      accessorKey: "roles",
      meta: t("form.label.roles"),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("form.label.roles")} />
      ),
      cell: ({ row }) => {
        const rolesValue: Array<Role> = row.getValue("roles");

        if (rolesValue.length === 0) return "-";

        return (
          <div className="flex items-center gap-1">
            {rolesValue.map((role, index) => (
              <div
                key={index}
                style={{ backgroundColor: role.color, color: "white" }}
                className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-sm`}
                title={role.name}
              >
                {role.name.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        const roles = row.getValue(id) as Array<Role>;
        return roles.some((role) => value.includes(role.name));
      },
    },
    StatusColumn<User, UserStatus>({
      accessorKey: "status",
      title: t("form.label.status"),
      statusOptions: UserStatusOptions(t),
      statusColorMap: UserStatusColorMap,
    }),
    {
      id: "actions",
      cell: ({ row }) => <UserDataTableRowActions row={row} />,
    },
  ];
}

useUserColumns.displayName = "useUserColumns";
export default useUserColumns;
