"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ClipboardList, CalendarDays, LogOut, Package, Truck, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useEffect } from "react";
import clsx from "clsx";
import { useAuth } from "@/auth/provider";
import { isCompanySession } from "@/auth/session";
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
  const router = useRouter();
  const tLanguage = useTranslations("language");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const { isReady, logout, session } = useAuth();
  const { locale, setLocale } = useAppLocale();
  const isCompany = isCompanySession(session);
  const visibleNavigation = isCompany
    ? navigation
    : navigation.filter((item) => item.href === "/" || item.href === "/orders");
  const isActiveRoute = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const canAccessRoute =
    isCompany ||
    pathname === "/" ||
    pathname === "/orders" ||
    (pathname.startsWith("/orders/") && pathname !== "/orders/new");

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!session) {
      router.replace("/login");
      return;
    }

    if (!canAccessRoute) {
      router.replace("/orders");
    }
  }, [canAccessRoute, isReady, router, session]);

  const leave = () => {
    logout();
    router.replace("/login");
  };

  if (!isReady || !session || !canAccessRoute) {
    return (
      <div className="min-h-screen bg-surface px-4 py-6 text-sm text-slate-600">
        {tCommon("processing")}
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white p-5 lg:block">
        <Link href="/" className="block text-lg font-bold text-ink">
          OVGS
        </Link>
        <nav className="mt-8 grid gap-1">
          {visibleNavigation.map((item) => {
            const isActive = isActiveRoute(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-surface hover:text-ink",
                  isActive && "bg-teal-50 text-brand"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon size={17} aria-hidden />
                {tNav(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="sticky top-0 z-30 min-w-0 border-b border-line bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:static lg:bg-white lg:px-8 lg:backdrop-blur-none">
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
              <div className="flex min-w-0 items-center gap-2 rounded-md bg-surface px-3 py-2 text-xs font-semibold text-slate-600">
                <span className="truncate">
                  {tAuth("signedInAs")}: {session.displayName}
                </span>
              </div>
              <button
                type="button"
                onClick={leave}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-ink hover:bg-surface"
              >
                <LogOut size={16} aria-hidden />
                {tAuth("logout")}
              </button>
            </div>
          </div>
        </header>
        <main className="min-w-0 max-w-full overflow-x-hidden px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-8">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <div
          className={clsx(
            "mx-auto grid max-w-xl gap-1",
            visibleNavigation.length <= 2 ? "grid-cols-2" : "grid-cols-6"
          )}
        >
          {visibleNavigation.map((item) => {
            const isActive = isActiveRoute(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "flex h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-md px-1 text-[10px] font-semibold leading-tight text-slate-600 transition hover:bg-surface hover:text-ink",
                  isActive && "bg-teal-50 text-brand"
                )}
              >
                <item.icon size={18} className="shrink-0" aria-hidden />
                <span className="w-full truncate text-center">{tNav(item.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
