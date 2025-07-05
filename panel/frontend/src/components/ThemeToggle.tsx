import { useTheme } from "@@/ThemeProvider";
import { Button } from "@@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@@/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type ThemeToggleProps = {
  collapsed?: boolean;
};

function ThemeToggle({ collapsed = true }: ThemeToggleProps) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState("");

  useEffect(() => {
    if (theme === "light") setCurrentTheme(t("settings.theme.light"));
    if (theme === "dark") setCurrentTheme(t("settings.theme.dark"));
    if (theme === "system") setCurrentTheme(t("settings.theme.system"));
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="self-start">
          <Button variant="outline" size={collapsed ? "icon" : "sm"}>
            {collapsed ? (
              <>
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">{t("settings.theme.change")}</span>
              </>
            ) : (
              currentTheme
            )}
          </Button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t("settings.theme.light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t("settings.theme.dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {t("settings.theme.system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

ThemeToggle.displayName = "ThemeToggle";
export default ThemeToggle;
