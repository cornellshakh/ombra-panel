import { useAuthContext } from "@/api/auth/AuthProvider";
import { useFetchContext } from "@/api/FetchProvider";
import { deleteSuspension, updateSuspensionStatus } from "@/api/suspensions";
import { SuspensionSchema, SuspensionStatusOptions } from "@/lib/schema";
import EditSuspensionModal from "@@/modals/EditSuspensionModal";
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

interface SuspensionDataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export default function SuspensionDataTableRowActions<TData>({
  row,
}: SuspensionDataTableRowActionsProps<TData>) {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const { toggleFetch } = useFetchContext();

  const rowSuspension = SuspensionSchema.parse(row.original);

  const [openEditSuspension, setOpenEditSuspension] = useState<boolean>(false);

  return (
    <div>
      <EditSuspensionModal
        suspensionData={rowSuspension}
        isOpen={openEditSuspension}
        onClose={() => setOpenEditSuspension(false)}
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
            onClick={() => setOpenEditSuspension(true)}
          >
            <ExternalLinkIcon size={16} className="mr-2" />
            {t("button.edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {t("component.table.suspension.actions.set_status")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={rowSuspension.status}>
                {Object.entries(SuspensionStatusOptions).map(([key, label]) => (
                  <DropdownMenuRadioItem
                    key={key}
                    value={key}
                    onClick={() =>
                      updateSuspensionStatus(
                        rowSuspension,
                        user?.userId,
                        key,
                        () => toggleFetch("suspensions")
                      )
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
              deleteSuspension(rowSuspension, () => toggleFetch("suspensions"));
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
