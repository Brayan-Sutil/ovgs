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
    <div className="overflow-hidden rounded-md border border-line bg-white">
      <div className="overflow-x-auto">
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
                  {order.deliveryDate ? formatDate(order.deliveryDate, locale) : tCommon("notAvailable")}
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
    </div>
  );
};
