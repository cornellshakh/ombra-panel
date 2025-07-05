import PasswordGenerator from "@/components/PasswordGenerator";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@@/ui/form";
import { Input } from "@@/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

type PasswordFieldProps = {
  name?: string;
  label?: string;
  placeholder?: string;
  description?: string;
  showGenerator?: boolean;
};

function PasswordField({
  name = "",
  label,
  placeholder,
  description,
  showGenerator = true,
}: PasswordFieldProps) {
  const { control, getFieldState, setValue } = useFormContext();
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const handlePasswordGenerated = (password: string) => {
    setValue(name, password, { shouldValidate: true });
  };

  const paddingRight = showGenerator ? "pr-16" : "pr-10";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={passwordVisibility ? "text" : "password"}
                autoComplete="on"
                placeholder={placeholder}
                className={`${
                  getFieldState(name).error && "text-destructive"
                } ${paddingRight}`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-3">
                {showGenerator && (
                  <PasswordGenerator
                    onPasswordGenerated={handlePasswordGenerated}
                  />
                )}
                <div
                  className="cursor-pointer text-muted-foreground"
                  onClick={() => setPasswordVisibility(!passwordVisibility)}
                >
                  {passwordVisibility ? (
                    <EyeOffIcon size={20} />
                  ) : (
                    <EyeIcon size={20} />
                  )}
                </div>
              </div>
            </div>
          </FormControl>
          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}

PasswordField.displayName = "PasswordField";
export default PasswordField;
