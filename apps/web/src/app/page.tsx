"use client";

import Link from "next/link";
import { OrdersTable } from "@/components/organisms/OrdersTable";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { useSalesOrders } from "@/features/sales-orders/hooks";
import { salesOrderStatuses } from "@/features/sales-orders/types";

export default function DashboardPage() {
  const ordersQuery = useSalesOrders();
  const orders = ordersQuery.data ?? [];

  return (
    <DashboardLayout
      title="Monitoramento Operacional"
      description="Visibilidade do ciclo logistico das Ordens de Venda."
    >
      <div className="mb-6 flex justify-end">
        <Link
          href="/orders/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-teal-800"
        >
          Nova Ordem
        </Link>
      </div>
      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {salesOrderStatuses.map((status) => {
          const total = orders.filter((order) => order.status === status).length;
          return (
            <div key={status} className="rounded-md border border-line bg-white p-4">
              <div className="text-xs font-semibold uppercase text-slate-500">
                {status.replace("_", " ")}
              </div>
              <div className="mt-3 text-3xl font-bold text-ink">{total}</div>
            </div>
          );
        })}
      </section>
      <OrdersTable orders={orders.slice(0, 8)} loading={ordersQuery.isLoading} />
    </DashboardLayout>
  );
}
