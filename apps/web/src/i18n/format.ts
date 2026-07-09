import { dateLocales, Locale } from "./messages";

export const formatDate = (value: string | Date, locale: Locale) => {
  return new Date(value).toLocaleDateString(dateLocales[locale]);
};

export const formatDateTime = (value: string | Date, locale: Locale) => {
  return new Date(value).toLocaleString(dateLocales[locale]);
};
