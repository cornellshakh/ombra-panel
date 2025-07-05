import { useAuthContext } from "@/api/auth/AuthProvider";
import { useFetchContext } from "@/api/FetchProvider";
import { editIndividualSetting } from "@/api/settings";
import { CurrencyFormat, CurrencyOptions } from "@/lib/schema";
import { Button } from "@@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@@/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

function CurrencySwitcher() {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const { toggleFetch, settings } = useFetchContext();

  function changeCurrency(currency: CurrencyFormat) {
    editIndividualSetting(
      user?.userId,
      "currency",
      settings.currency,
      currency,
      () => toggleFetch("settings")
    );
  }

  function getCurrentCurrencyDescription(): string {
    return CurrencyOptions(t)[settings?.currency]?.description;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="self-start">
          <Button variant="outline">
            <span className="ml-2">{getCurrentCurrencyDescription()}</span>
            <span className="sr-only">{t("settings.currency.change")}</span>
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {Object.entries(CurrencyOptions(t)).map(([code, { description }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => changeCurrency(code as CurrencyFormat)}
          >
            {description}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

CurrencySwitcher.displayName = "CurrencySwitcher";
export default CurrencySwitcher;
