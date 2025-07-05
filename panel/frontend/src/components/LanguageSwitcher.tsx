import { useAuthContext } from "@/api/auth/AuthProvider";
import { useFetchContext } from "@/api/FetchProvider";
import { editIndividualSetting } from "@/api/settings";
import supportedLanguages from "@/languages/languages";
import { Button } from "@@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@@/ui/dropdown-menu";
import { GlobeIcon } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthContext();
  const { toggleFetch, settings } = useFetchContext();

  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings]);

  function changeLanguage(language: string) {
    editIndividualSetting(
      user?.userId,
      "language",
      settings.language,
      language,
      () => toggleFetch("settings")
    );
  }

  function getCurrentLanguageName() {
    return supportedLanguages[settings.language];
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="self-start">
          <Button variant="outline">
            <GlobeIcon className="h-[1.2rem] w-[1.2rem]" />
            <span className="ml-2">{getCurrentLanguageName()}</span>
            <span className="sr-only">{t("settings.language.change")}</span>
          </Button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {Object.entries(supportedLanguages).map(([code, name]) => (
          <DropdownMenuItem key={code} onClick={() => changeLanguage(code)}>
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

LanguageSwitcher.displayName = "LanguageSwitcher";
export default LanguageSwitcher;
