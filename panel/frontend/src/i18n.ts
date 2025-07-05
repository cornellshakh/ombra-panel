import supportedLanguages from "@/languages/languages";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export default i18n
  .use(HttpApi)
  .use(LanguageDetector) // detects user language
  .use(initReactI18next) // pass i18n instance to react-i18next
  .init({
    supportedLngs: Object.keys(supportedLanguages),
    fallbackLng: "en",
    detection: {
      order: ["querystring", "localStorage"],
      caches: ["localStorage"],
    },
    backend: {
      loadPath: "/src/languages/{{lng}}/translation.json",
    },
    react: {
      useSuspense: true,
    },
  });

export const getTranslation = (
  key: string | string[],
  options?: Record<string, string | number | undefined>
) => i18n.t(key, { options });
