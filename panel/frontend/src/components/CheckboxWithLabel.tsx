import { Checkbox } from "@@/ui/checkbox";

type CheckboxWithLabelProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  right?: boolean;
  className?: string;
};

function CheckboxWithLabel({
  label,
  checked,
  onChange,
  right = false,
  className = "",
}: CheckboxWithLabelProps) {
  return (
    <div className={`flex ${right ? "justify-end" : ""} ${className}`}>
      <label
        className={`flex items-center cursor-pointer ${right ? "flex-row-reverse" : ""}`}
      >
        <Checkbox
          checked={checked}
          onCheckedChange={onChange}
          className={right ? "ml-2" : "mr-2"}
        />
        <span>{label}</span>
      </label>
    </div>
  );
}

CheckboxWithLabel.displayName = "CheckboxWithLabel";
export default CheckboxWithLabel;
