import { Badge } from "@@/ui/badge";
import { Button } from "@@/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@@/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@@/ui/popover";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";

export type OptionType = {
  label: string;
  value: string;
};

type MultiSelectProps = {
  options: OptionType[];
  selected: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
  buttonSize?: "sm" | "default" | "lg" | "icon" | null | undefined;
  label?: string;
  search?: boolean;
  disabled?: boolean;
  className?: string;
};

function MultiSelect({
  options,
  selected,
  onChange,
  buttonSize = "sm",
  label,
  search,
  disabled,
  className,
  ...props
}: MultiSelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [temporarySelected, setTemporarySelected] =
    useState<string[]>(selected);

  function handleUnselect(item: string) {
    onChange(selected.filter((i) => i !== item));
  }

  function applySelection() {
    onChange(temporarySelected);
    setOpen(false);
  }

  function handleSelectOption(value: string) {
    setTemporarySelected((currentSelected) =>
      currentSelected.includes(value)
        ? currentSelected.filter((item) => item !== value)
        : [...currentSelected, value]
    );
  }

  function handlePopoverOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) {
      setTemporarySelected(selected);
    }
  }

  return (
    <Popover open={open} onOpenChange={handlePopoverOpenChange} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={buttonSize}
          role="combobox"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <div>
            {selected.map((item) => (
              <Badge
                variant="secondary"
                key={item}
                className="mr-1 mb-1 rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnselect(item);
                }}
              >
                {item}
                <div
                  role="button"
                  tabIndex={0}
                  className="ml-1 ring-offset-background outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnselect(item);
                  }}
                  aria-label={`${t("button.remove")} ${item}`}
                >
                  <XIcon
                    size={12}
                    className="text-muted-foreground hover:text-foreground"
                  />
                </div>
              </Badge>
            ))}
          </div>
          <div className="flex justify-center items-center">
            <ChevronsUpDownIcon
              size={16}
              className="mr-2 shrink-0 opacity-50"
            />
            {label}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className={className}>
          {search && (
            <div>
              <CommandInput placeholder={t("form.placeholder.search.search")} />
              <CommandEmpty>{t("error.item_not_found")}</CommandEmpty>
            </div>
          )}

          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelectOption(option.value)}
                disabled={disabled}
              >
                <CheckIcon
                  className={`mr-2 h-4 w-4 ${temporarySelected.includes(option.value) ? "opacity-100" : "opacity-0"}`}
                />

                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <div className="flex justify-center py-2">
            <Button
              onClick={applySelection}
              disabled={temporarySelected.length === 0}
            >
              {t("button.apply")}
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

MultiSelect.displayName = "MultiSelect";
export default MultiSelect;
