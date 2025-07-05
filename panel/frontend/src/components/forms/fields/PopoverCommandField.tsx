import { Button } from "@@/ui/button";
import { Command, CommandGroup, CommandItem } from "@@/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@@/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@@/ui/popover";
import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

type PopoverCommandFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  options: any[];
  optionKey: keyof any;
  optionValue: keyof any;
  disabled?: boolean; // Add disabled prop
  onSelect?: (value: any) => void; // Add onSelect prop
};

function PopoverCommandField({
  name,
  label,
  placeholder,
  options,
  optionKey,
  optionValue,
  disabled = false, // Default to false if not provided
  onSelect,
}: PopoverCommandFieldProps) {
  const [open, setOpen] = useState(false);
  const { control, setValue } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  disabled={disabled} // Disable button if prop is true
                >
                  {field.value
                    ? options.find(
                        (option) => option[optionKey] === field.value
                      )?.[optionValue] || placeholder
                    : placeholder}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
                <Command className="w-full">
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option[optionKey]}
                        value={option[optionValue]}
                        onSelect={() => {
                          // Set only the value (ID) that is expected by the form
                          field.onChange(option[optionKey]);
                          setValue(name, option[optionKey]);
                          setOpen(false);
                          if (onSelect) {
                            onSelect(option[optionKey]); // Trigger parent handler
                          }
                        }}
                      >
                        {option[optionValue]}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

PopoverCommandField.displayName = "PopoverCommandField";
export default PopoverCommandField;
