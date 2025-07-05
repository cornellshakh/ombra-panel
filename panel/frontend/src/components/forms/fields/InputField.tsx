import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@@/ui/form";
import { Input } from "@@/ui/input";
import { useFormContext } from "react-hook-form";

type InputFieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  type?: string;
};

function InputField({
  name,
  label,
  placeholder,
  description,
  type = "text",
}: InputFieldProps) {
  const { control, getFieldState } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              className={`${getFieldState(name).error && "text-destructive"}`}
              // Ensure correct numeric handling
              onChange={(e) => {
                const value =
                  type === "number"
                    ? e.target.value === ""
                      ? undefined
                      : e.target.valueAsNumber
                    : e.target.value;

                // Handle the change properly
                field.onChange(value);
              }}
              value={field.value ?? ""} // Ensure the value is controlled
            />
          </FormControl>
          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}

InputField.displayName = "InputField";
export default InputField;
