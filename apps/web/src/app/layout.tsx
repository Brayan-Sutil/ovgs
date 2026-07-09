import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { defaultLocale, messages } from "@/i18n/messages";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: messages[defaultLocale].metadata.title,
  description: messages[defaultLocale].metadata.description
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang={defaultLocale}>
      <body>
        <NextIntlClientProvider locale={defaultLocale} messages={messages[defaultLocale]}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
