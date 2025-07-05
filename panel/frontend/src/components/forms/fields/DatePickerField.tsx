import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@@/ui/form";
  import { CalendarIcon } from "lucide-react";
  import { useFormContext } from "react-hook-form";
  import { Button } from "@@/ui/button";
  import { Popover, PopoverContent, PopoverTrigger } from "@@/ui/popover";
  import { Calendar } from "@@/ui/calendar"; // Assuming you have a Calendar component
  import { formatDate } from "@/lib/utils"; // Assuming you have a utility function to format dates
  
  type DatePickerFieldProps = {
    name: string;
    label?: string;
    placeholder?: string;
    description?: string;
    optional?: boolean; // Optional if you want to use it
  };
  
  function DatePickerField({
    name,
    label,
    placeholder,
    description,
  }: DatePickerFieldProps) {
    const { control, getFieldState } = useFormContext();
  
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start ${
                      getFieldState(name).error && "text-destructive"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value
                      ? formatDate(new Date(field.value), "en-US", "MM/dd/yyyy")
                      : placeholder || "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(date?.toISOString());
                    }}
                    mode="single"
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
            {description && <FormDescription>{description}</FormDescription>}
          </FormItem>
        )}
      />
    );
  }
  
  DatePickerField.displayName = "DatePickerField";
  export default DatePickerField;
  