import { TimeFormat } from "@/lib/schema";
import { Label } from "@@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@@/ui/select";
import { useTranslation } from "react-i18next";

type TimePickerProps = {
  label: string;
  format: TimeFormat;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
};

function TimePicker({ label, format, value, onChange }: TimePickerProps) {
  const { t } = useTranslation();

  const hours = Array.from(
    { length: format === "24" ? 24 : 12 },
    (_, i) => i + (format === "24" ? 0 : 1)
  );
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ["AM", "PM"];

  function handleHourChange(hour: number) {
    const newDate = value ? new Date(value) : new Date();
    if (format === "12" && value && value?.getHours() >= 12) hour += 12;
    newDate.setHours(hour);
    onChange(newDate);
  }

  function handleMinuteChange(minute: number) {
    const newDate = value ? new Date(value) : new Date();
    newDate.setMinutes(minute);
    onChange(newDate);
  }

  function handlePeriodChange(period: string) {
    const newDate = value ? new Date(value) : new Date();
    let hours = newDate.getHours();
    if (period === "PM" && hours < 12) hours += 12;
    else if (period === "AM" && hours >= 12) hours -= 12;
    newDate.setHours(hours);
    onChange(newDate);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        className={
          format === "12"
            ? "md:grid md:grid-cols-3 md:gap-1 space-y-2 md:space-y-0"
            : "md:grid md:grid-cols-2 md:gap-1"
        }
      >
        <Select onValueChange={(val) => handleHourChange(parseInt(val))}>
          <SelectTrigger id="hour">
            <SelectValue placeholder={t("settings.time.hour")} />
          </SelectTrigger>
          <SelectContent>
            {hours.map((hour) => (
              <SelectItem key={hour} value={hour.toString()}>
                {hour < 10 ? `0${hour}` : hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => handleMinuteChange(parseInt(val))}>
          <SelectTrigger id="minute">
            <SelectValue placeholder={t("settings.time.minute")} />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((minute) => (
              <SelectItem key={minute} value={minute.toString()}>
                {minute < 10 ? `0${minute}` : minute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {format === "12" && (
          <Select onValueChange={handlePeriodChange}>
            <SelectTrigger id="period">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}

TimePicker.displayName = "TimePicker";
export default TimePicker;
