import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { DateFormat } from "./schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copyToClipboard(
  name: string,
  text: string,
  t: (arg: string) => string
) {
  try {
    await navigator.clipboard.writeText(text);
    toast.info(`${name} ${t("message.copied_to_clipboard")}`, {});
  } catch (error) {
    toast.error(`${t("error.failed_to_copy")} ${name}`, {});
  }
}

export function isStringEmpty(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === "";
}

export const getDefaultZodValues = (schema: z.ZodTypeAny): any => {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    return Object.keys(shape).reduce(
      (acc, key) => {
        acc[key] = getDefaultZodValues(shape[key]);
        return acc;
      },
      {} as Record<string, any>
    );
  }

  if (schema instanceof z.ZodArray) return [];

  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable)
    return undefined;

  if (schema instanceof z.ZodDefault) return schema._def.defaultValue();

  if (schema instanceof z.ZodEnum) return schema.options[0];

  if (schema instanceof z.ZodBoolean) return false;

  if (schema instanceof z.ZodString) return "";

  if (schema instanceof z.ZodNumber) return 0;

  if (schema instanceof z.ZodDate) return null;

  if (schema instanceof z.ZodUnion)
    return getDefaultZodValues(schema._def.options[0]);

  if (
    schema instanceof z.ZodEffects &&
    schema._def.effect.type === "refinement"
  )
    return getDefaultZodValues(schema._def.schema);

  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable)
    return schema instanceof z.ZodNullable ? null : undefined;

  return undefined;
};

export function formatDate(
  date: Date,
  locale: string,
  dateFormat: DateFormat
): string {
  if (isNaN(date.getTime())) return "-";

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth is zero-based
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  let dateString = "";

  switch (dateFormat) {
    case "DD.MM.YYYY":
      dateString = `${day}.${month}.${year}`;
      break;
    case "DD-MM-YYYY":
      dateString = `${day}-${month}-${year}`;
      break;
    case "DD/MM/YYYY":
      dateString = `${day}/${month}/${year}`;
      break;
    case "MM/DD/YYYY":
      dateString = `${month}/${day}/${year}`;
      break;
    case "MM-DD-YYYY":
      dateString = `${month}-${day}-${year}`;
      break;
    case "YYYY/MM/DD":
      dateString = `${year}/${month}/${day}`;
      break;
    case "YYYY-MM-DD":
      dateString = `${year}-${month}-${day}`;
      break;

    default:
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      };

      dateString = new Intl.DateTimeFormat(locale, options).format(date);
  }

  dateString += ` ${hours}:${minutes}:${seconds}`;

  return dateString;
}

// export function formatCurrency(
//   amount: number,
//   currencyCode: CurrencyFormat
// ): string {
//   const currencyDetail = CurrencyOptions(t)[currencyCode];
//   const locale = currencyDetail.locale;

//   const options: Intl.NumberFormatOptions = {
//     style: "currency",
//     currency: currencyCode,
//     currencyDisplay: "symbol",
//   };

//   return new Intl.NumberFormat(locale, options).format(amount);
// }
