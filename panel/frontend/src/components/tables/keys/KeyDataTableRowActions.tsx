import { useFetchContext } from "@/api/FetchProvider";
import { deleteKey } from "@/api/keys";
import { KeySchema } from "@/lib/schema";
import EditKeyModal from "@@/modals/EditKeyModal";
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

type KeyDataTableRowActionsProps<TData> = {
  row: Row<TData>;
};

export default function KeyDataTableRowActions<TData>({
  row,
}: KeyDataTableRowActionsProps<TData>) {
  const { t } = useTranslation();

  const key = KeySchema(t).parse(row.original);

  const [openEditKey, setOpenEditKey] = useState<boolean>(false);
  const { toggleFetch } = useFetchContext();

  return (
    <div>
      <EditKeyModal
        keyData={key}
        isOpen={openEditKey}
        onClose={() => setOpenEditKey(false)}
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
            onClick={() => setOpenEditKey(true)}
          >
            <ExternalLinkIcon size={16} className="mr-2" />
            {t("button.edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="focus:bg-red-500 focus:text-white cursor-pointer"
            onClick={() => deleteKey(key, () => toggleFetch("keys"))}
          >
            <TrashIcon size={16} className="mr-2" />
            {t("button.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
