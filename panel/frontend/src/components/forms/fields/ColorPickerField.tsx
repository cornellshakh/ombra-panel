import ColorPicker from "@@/ColorPicker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@@/ui/form";
import { useFormContext } from "react-hook-form";

type ColorPickerFieldProps = {
  name?: string;
  label?: string;
};

function ColorPickerField({ name = "", label }: ColorPickerFieldProps) {
  const { control, setValue } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <ColorPicker
              color={field.value!}
              setColor={(color) => setValue(name, color)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

ColorPickerField.displayName = "ColorPickerField";
export default ColorPickerField;
