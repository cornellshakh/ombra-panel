import { useController, Control } from "react-hook-form";
import CheckboxWithLabel from "@/components/CheckboxWithLabel";

type CheckboxFieldProps = {
  name: string;
  label: string;
  control: Control<any>;
  right?: boolean;
  className?: string;
};

function CheckboxField({
  name,
  label,
  control,
  right = false,
  className = "",
}: CheckboxFieldProps) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: false, // default to unchecked
  });

  return (
    <div className={className}>
      <CheckboxWithLabel
        label={label}
        checked={value}
        onChange={onChange}
        right={right}
      />
      {error && <span className="text-red-600">{error.message}</span>}
    </div>
  );
}

CheckboxField.displayName = "CheckboxField";
export default CheckboxField;
