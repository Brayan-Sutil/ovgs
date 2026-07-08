import Link from "next/link";
import { ClipboardList, CalendarDays, Package, Truck, Users } from "lucide-react";
import { ReactNode } from "react";
import clsx from "clsx";

const navigation = [
  { href: "/", label: "Operacao", icon: ClipboardList },
  { href: "/orders", label: "Ordens", icon: ClipboardList },
  { href: "/scheduling", label: "Agendamento", icon: CalendarDays },
  { href: "/customers", label: "Clientes", icon: Users },
  { href: "/transport-types", label: "Transportes", icon: Truck },
  { href: "/items", label: "Itens", icon: Package }
];

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
  return (
    <div className="min-h-screen bg-surface">
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
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="border-b border-line bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-ink">{title}</h1>
              {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
            </div>
            {action}
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-medium"
              >
                <item.icon size={16} aria-hidden />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};
