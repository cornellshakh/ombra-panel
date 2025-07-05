import { useAuthContext } from "@/api/auth/AuthProvider";
import { useFetchContext } from "@/api/FetchProvider";
import { deleteUser, updateUserStatus } from "@/api/users";
import { UserSchema, UserStatusOptions } from "@/lib/schema";
import EditUserModal from "@@/modals/EditUserModal";
import { Button } from "@@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@@/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { ExternalLinkIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type UserDataTableRowActionsProps<TData> = {
  row: Row<TData>;
};

export default function UserDataTableRowActions<TData>({
  row,
}: UserDataTableRowActionsProps<TData>) {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const { toggleFetch } = useFetchContext();

  const rowUser = UserSchema(t).parse(row.original);

  const [openEditUser, setOpenEditUser] = useState<boolean>(false);

  return (
    <div>
      <EditUserModal
        userData={rowUser}
        isOpen={openEditUser}
        onClose={() => setOpenEditUser(false)}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontalIcon size={16} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            className="cursor-pointer w-full"
            onClick={() => setOpenEditUser(true)}
          >
            <ExternalLinkIcon size={16} className="mr-2" />
            {t("button.edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {t("component.table.user.actions.set_status")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={rowUser.status}>
                {Object.entries(UserStatusOptions(t))
                  .filter(([key]) => key !== "inactive")
                  .map(([key, label]) => (
                    <DropdownMenuRadioItem
                      key={key}
                      value={key}
                      onClick={() =>
                        updateUserStatus(rowUser, user?.userId, key, () => {
                          toggleFetch("users");
                          toggleFetch("suspensions");
                        })
                      }
                      className="cursor-pointer"
                    >
                      {label}
                    </DropdownMenuRadioItem>
                  ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="focus:bg-red-500 focus:text-white cursor-pointer"
            onClick={() => {
              if (user?.userId == rowUser.userId) {
                toast.error("User cant delete himself while logged in");
                return;
              }

              deleteUser(rowUser, () => toggleFetch("users"));
            }}
          >
            <TrashIcon size={16} className="mr-2" />
            {t("button.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
