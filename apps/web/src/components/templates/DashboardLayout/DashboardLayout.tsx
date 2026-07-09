"use client";

import Link from "next/link";
import { ClipboardList, CalendarDays, Package, Truck, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import clsx from "clsx";
import { Locale, localeNames, locales } from "@/i18n/messages";
import { useAppLocale } from "@/i18n/provider";

const navigation = [
  { href: "/", labelKey: "operation", icon: ClipboardList },
  { href: "/orders", labelKey: "orders", icon: ClipboardList },
  { href: "/scheduling", labelKey: "scheduling", icon: CalendarDays },
  { href: "/customers", labelKey: "customers", icon: Users },
  { href: "/transport-types", labelKey: "transportTypes", icon: Truck },
  { href: "/items", labelKey: "items", icon: Package }
] as const;

type DashboardLayoutProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export const DashboardLayout = ({
  title,
  description,
  action,
  children
}: DashboardLayoutProps) => {
  const tLanguage = useTranslations("language");
  const tNav = useTranslations("nav");
  const { locale, setLocale } = useAppLocale();

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white p-5 lg:block">
        <Link href="/" className="block text-lg font-bold text-ink">
          OVGS
        </Link>
        <nav className="mt-8 grid gap-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-surface hover:text-ink"
              )}
            >
              <item.icon size={17} aria-hidden />
              {tNav(item.labelKey)}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="min-w-0 border-b border-line bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-bold text-ink">{title}</h1>
              {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <span>{tLanguage("label")}</span>
                <select
                  value={locale}
                  onChange={(event) => setLocale(event.target.value as Locale)}
                  className="h-9 rounded-md border border-line bg-white px-2 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100"
                >
                  {locales.map((availableLocale) => (
                    <option key={availableLocale} value={availableLocale}>
                      {localeNames[availableLocale]}
                    </option>
                  ))}
                </select>
              </label>
              {action}
            </div>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-medium"
              >
                <item.icon size={16} aria-hidden />
                {tNav(item.labelKey)}
              </Link>
            ))}
          </nav>
        </header>
        <main className="min-w-0 max-w-full overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};
