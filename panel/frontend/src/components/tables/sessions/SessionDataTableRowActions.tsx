import { SessionSchema } from "@/lib/schema";
import { Button } from "@@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@@/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { ExternalLinkIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type SessionDataTableRowActionsProps<TData> = {
  row: Row<TData>;
};

export default function SessionDataTableRowActions<TData>({
  row,
}: SessionDataTableRowActionsProps<TData>) {
  const { t } = useTranslation();

  const session = SessionSchema(t).parse(row.original);

  const [openWarning, setOpenWarning] = useState<boolean>(false);

  return (
    <div>
      {/* <AlertModal
        isOpen={openWarning}
        onClose={() => setOpenWarning(false)}
        onConfirm={() => handleDeleteSession(session.sessionId)}
      /> */}

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
          <Link
            to="/session/open"
            state={session}
            className="flex items-center "
          >
            <DropdownMenuItem className="cursor-pointer w-full">
              <ExternalLinkIcon size={16} className="mr-2" />
              {t("button.open")}
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />

          {/* <DropdownMenuSub>
            <DropdownMenuSubTrigger>Set status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={session.status}>
                {statuses
                  .filter((status) => status.value !== "inactive")
                  .map((status) => (
                    <DropdownMenuRadioItem
                      session={status.value}
                      value={status.value}
                      onClick={
                        () => console.log("status.value", status.value)
                        //handleChangeStatus(session.sessionId, status.value)
                      }
                      className="cursor-pointer"
                    >
                      {status.label}
                    </DropdownMenuRadioItem>
                  ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub> */}
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="focus:bg-banned focus:text-banned-foreground cursor-pointer"
            onClick={() => setOpenWarning(true)}
          >
            <TrashIcon size={16} className="mr-2" />
            {t("button.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
