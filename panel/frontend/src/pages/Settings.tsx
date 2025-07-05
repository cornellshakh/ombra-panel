import { useFetchContext } from "@/api/FetchProvider";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import DateSwitcher from "@/components/DateSwitcher";
import TimeSwitcher from "@/components/TimeSwitcher";
import LanguageSwitcher from "@@/LanguageSwitcher";
import ThemeToggle from "@@/ThemeToggle";
import { Label } from "@@/ui/label";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const { t } = useTranslation();
  const { toggleFetch } = useFetchContext();
  const [isFetchInitiated, setIsFetchInitiated] = useState(false);

  useEffect(() => {
    if (!isFetchInitiated) {
      toggleFetch("settings");
      setIsFetchInitiated(true);
    }
  }, [isFetchInitiated, toggleFetch]);

  return (
    <div className="flex flex-col space-y-5">
      <Label>{t("settings.theme.title")}</Label>
      <ThemeToggle collapsed={false} />

      <Label>{t("settings.language.title")}</Label>
      <LanguageSwitcher />

      <Label>{t("settings.date.title")}</Label>
      <DateSwitcher />

      <Label>{t("settings.currency.title")}</Label>
      <CurrencySwitcher />

      <Label>{t("settings.time.title")}</Label>
      <TimeSwitcher />
    </div>
  );
}
