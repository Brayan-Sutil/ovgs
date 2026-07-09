"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "@/auth/provider";
import { isCompanySession } from "@/auth/session";
import { ScheduleForm } from "@/components/organisms/ScheduleForm";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { useSchedulableOrders } from "@/features/sales-orders/hooks";

const SchedulingPage = () => {
  const tScheduling = useTranslations("scheduling");
  const { isReady, session } = useAuth();
  const isCompany = isCompanySession(session);
  const ordersQuery = useSchedulableOrders(Boolean(session) && isCompany);
  const orders = ordersQuery.data ?? [];

  return (
    <DashboardLayout title={tScheduling("title")} description={tScheduling("description")}>
      {!isReady || ordersQuery.isLoading ? (
        <div className="rounded-md border border-line bg-white p-5 text-sm">{tScheduling("loading")}</div>
      ) : null}

      {isReady && !ordersQuery.isLoading && orders.length === 0 ? (
        <div className="rounded-md border border-line bg-white p-5 text-sm">
          {tScheduling("empty")}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-2">
        {orders.map((order) => (
          <div key={order.id} className="grid gap-3">
            <div className="rounded-md border border-line bg-white p-4">
              <Link href={`/orders/${order.id}`} className="text-sm font-bold text-brand hover:text-teal-800">
                {order.code}
              </Link>
              <div className="mt-1 text-sm text-slate-700">
                {order.customer.name} - {order.transportType.name}
              </div>
            </div>
            <ScheduleForm order={order} />
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default SchedulingPage;
