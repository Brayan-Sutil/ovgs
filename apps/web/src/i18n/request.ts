import { getRequestConfig } from "next-intl/server";
import { defaultLocale, messages } from "./messages";

export default getRequestConfig(async () => {
  return {
    locale: defaultLocale,
    messages: messages[defaultLocale]
  };
});
