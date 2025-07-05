import { useAuthContext } from "@/api/auth/AuthProvider";
import { useFetchContext } from "@/api/FetchProvider";
import { editIndividualSetting } from "@/api/settings";
import { TimeFormatSchema } from "@/lib/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@@/ui/dropdown-menu";
import { ClockIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

function TimeSwitcher() {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const { toggleFetch, settings } = useFetchContext();

  function changeTimeFormat(format: string) {
    editIndividualSetting(user?.userId, "time", settings.time, format, () =>
      toggleFetch("settings")
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="self-start">
          <Button variant="outline">
            <ClockIcon className="h-[1.2rem] w-[1.2rem]" />
            <span className="ml-2">{settings.time}</span>
            <span className="sr-only">{t("settings.date.change")}</span>
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {TimeFormatSchema.options.map((format) => (
          <DropdownMenuItem
            key={format}
            onClick={() => changeTimeFormat(format)}
          >
            {format}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

TimeSwitcher.displayName = "TimeSwitcher";
export default TimeSwitcher;
