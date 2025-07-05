import { copyToClipboard } from "@/lib/utils";
import { Button } from "@@/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@@/ui/popover";
import { CopyIcon, DicesIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonWithIcon from "./ButtonWithIcon";
import CheckboxWithLabel from "./CheckboxWithLabel";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";

type PasswordGeneratorProps = {
  onPasswordGenerated: (password: string) => void;
};

function PasswordGenerator({ onPasswordGenerated }: PasswordGeneratorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [passwordLength, setPasswordLength] = useState<number>(20);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useLettersUppercase, setUseLettersUppercase] = useState<boolean>(true);
  const [useLettersLowercase, setUseLettersLowercase] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);

  function generatePassword(): string {
    const numbers = "0123456789";
    const lettersUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lettersLowercase = "abcdefghijklmnopqrstuvwxyz";
    const symbols = "!@#$%^&*";
    let validChars = "";
    if (useNumbers) validChars += numbers;
    if (useLettersUppercase) validChars += lettersUppercase;
    if (useLettersLowercase) validChars += lettersLowercase;
    if (useSymbols) validChars += symbols;

    let generatedPassword = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * validChars.length);
      generatedPassword += validChars[randomIndex];
    }
    setGeneratedPassword(generatedPassword);
    onPasswordGenerated(generatedPassword);
    return generatedPassword;
  }

  const handleGenerateAndCopy = () => {
    const newPassword = generatePassword();
    copyToClipboard(t("form.label.password"), newPassword, t);
  };

  const canGenerate =
    useNumbers || useLettersUppercase || useLettersLowercase || useSymbols;

  useEffect(() => {
    if (
      isOpen &&
      (useNumbers || useLettersUppercase || useLettersLowercase || useSymbols)
    ) {
      generatePassword();
    }
  }, [
    isOpen,
    passwordLength,
    useNumbers,
    useLettersUppercase,
    useLettersLowercase,
    useSymbols,
  ]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild className="cursor-pointer text-muted-foreground">
        <DicesIcon width={20} height={20} />
      </PopoverTrigger>
      <PopoverContent>
        <Input
          value={generatedPassword || ""}
          readOnly
          className="overflow-hidden text-ellipsis whitespace-nowrap"
        />

        <div className="p-2 pb-0 flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <Slider
              defaultValue={[passwordLength]}
              min={8}
              max={35}
              step={1}
              onValueChange={(values) => setPasswordLength(values[0])}
            />
            <span className="w-6 text-right">{passwordLength} </span>
          </div>

          <div className="flex flex-wrap justify-between">
            <CheckboxWithLabel
              label="A-Z"
              checked={useLettersUppercase}
              onChange={setUseLettersUppercase}
            />

            <CheckboxWithLabel
              label="a-z"
              checked={useLettersLowercase}
              onChange={setUseLettersLowercase}
              right={true}
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-between">
            <CheckboxWithLabel
              label="0-9"
              checked={useNumbers}
              onChange={setUseNumbers}
            />

            <CheckboxWithLabel
              label="!@#$%^&*"
              checked={useSymbols}
              onChange={setUseSymbols}
              right={true}
            />
          </div>

          <div className="flex flex-row space-x-2">
            <Button
              onClick={handleGenerateAndCopy}
              disabled={!canGenerate}
              className="w-full"
            >
              {t("button.generate_password")}
            </Button>

            <ButtonWithIcon
              size="default"
              icon={CopyIcon}
              onClick={() =>
                copyToClipboard(t("form.label.password"), generatedPassword, t)
              }
              disabled={!canGenerate}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

PasswordGenerator.displayName = "PasswordGenerator";
export default PasswordGenerator;
