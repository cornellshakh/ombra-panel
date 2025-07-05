import { useAuthContext } from "@/api/auth/AuthProvider";
import { useFetchContext } from "@/api/FetchProvider";
import { editIndividualSetting } from "@/api/settings";
import { DateFormat, DateFormatOptions } from "@/lib/schema";
import { Button } from "@@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@@/ui/dropdown-menu";
import { Calendar as CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

function DateSwitcher() {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const { toggleFetch, settings } = useFetchContext();

  function changeDateFormat(format: DateFormat) {
    editIndividualSetting(user?.userId, "date", settings.date, format, () =>
      toggleFetch("settings")
    );
  }

  function getCurrentFormatDescription(): string {
    return DateFormatOptions(t)[settings.date];
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="self-start">
          <Button variant="outline">
            <CalendarIcon className="h-[1.2rem] w-[1.2rem]" />
            <span className="ml-2">{getCurrentFormatDescription()}</span>
            <span className="sr-only">{t("settings.date.change")}</span>
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {Object.entries(DateFormatOptions(t)).map(([format, description]) => (
          <DropdownMenuItem
            key={format}
            onClick={() => changeDateFormat(format as DateFormat)}
          >
            {description}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

DateSwitcher.displayName = "DateSwitcher";
export default DateSwitcher;
