"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/molecules/EmptyState";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { SalesOrder } from "@/features/sales-orders/types";
import { formatDate } from "@/i18n/format";
import { useAppLocale } from "@/i18n/provider";

type OrdersTableProps = {
  orders: SalesOrder[];
  loading?: boolean;
};

export const OrdersTable = ({ orders, loading }: OrdersTableProps) => {
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");
  const tOrders = useTranslations("orders");
  const { locale } = useAppLocale();
  const getDeliveryLabel = (order: SalesOrder) =>
    order.deliveryDate ? formatDate(order.deliveryDate, locale) : tCommon("notAvailable");

  if (loading) {
    return <div className="rounded-md border border-line bg-white p-5 text-sm">{tOrders("loading")}</div>;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title={tOrders("emptyTitle")}
        description={tOrders("emptyDescription")}
      />
    );
  }

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {orders.map((order) => (
          <article key={order.id} className="rounded-md border border-line bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/orders/${order.id}`}
                  className="break-words text-base font-bold text-brand hover:text-teal-800"
                >
                  {order.code}
                </Link>
                <div className="mt-1 break-words text-sm font-semibold text-ink">
                  {order.customer.name}
                </div>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-xs font-semibold uppercase text-slate-500">
                  {tOrders("transport")}
                </dt>
                <dd className="break-words text-right font-medium text-slate-700">
                  {order.transportType.name}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-xs font-semibold uppercase text-slate-500">
                  {tOrders("delivery")}
                </dt>
                <dd className="text-right font-medium text-slate-700">
                  {getDeliveryLabel(order)}
                </dd>
              </div>
            </dl>

            <Link
              href={`/orders/${order.id}`}
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md border border-line bg-white text-sm font-semibold text-brand hover:bg-surface"
            >
              {tCommon("open")}
            </Link>
          </article>
        ))}
      </div>

      <div className="hidden rounded-md border border-line bg-white md:block md:overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">{tOrders("code")}</th>
              <th className="px-4 py-3 font-semibold">{tOrders("customer")}</th>
              <th className="px-4 py-3 font-semibold">{tOrders("transport")}</th>
              <th className="px-4 py-3 font-semibold">{tFilters("status")}</th>
              <th className="px-4 py-3 font-semibold">{tOrders("delivery")}</th>
              <th className="px-4 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-surface">
                <td className="px-4 py-3 font-semibold text-ink">{order.code}</td>
                <td className="px-4 py-3 text-slate-700">{order.customer.name}</td>
                <td className="px-4 py-3 text-slate-700">{order.transportType.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {getDeliveryLabel(order)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-sm font-semibold text-brand hover:text-teal-800"
                  >
                    {tCommon("open")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
