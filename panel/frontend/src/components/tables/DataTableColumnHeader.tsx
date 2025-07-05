import { cn } from "@/lib/utils";
import { Button } from "@@/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  ariaLabel?: string;
  className?: string;
}

export default function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) return <div className={cn(className)}>{title}</div>;

  const toggleSort = () => {
    const isSortedDesc = column.getIsSorted() === "desc";
    column.toggleSorting(!isSortedDesc);
  };

  const SortIcon =
    column.getIsSorted() === "desc"
      ? ArrowDownIcon
      : column.getIsSorted() === "asc"
        ? ArrowUpIcon
        : CaretSortIcon;

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-1 text-xs -ml-3"
        onClick={toggleSort}
      >
        <span>{title}</span>
        {/* This is the only place where we keep size of the icon in the className */}
        <SortIcon className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
