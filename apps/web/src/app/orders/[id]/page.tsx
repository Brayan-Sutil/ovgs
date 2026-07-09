"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/auth/provider";
import { isCompanySession } from "@/auth/session";
import { AuditTimeline } from "@/components/organisms/AuditTimeline";
import { OrderDetailsPanel } from "@/components/organisms/OrderDetailsPanel";
import { ScheduleForm } from "@/components/organisms/ScheduleForm";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { DetailPageLayout } from "@/components/templates/DetailPageLayout";
import { useSalesOrder, useSalesOrderAuditEvents } from "@/features/sales-orders/hooks";

const OrderDetailsPage = ({ params }: { params: { id: string } }) => {
  const tAuth = useTranslations("auth");
  const tOrders = useTranslations("orders");
  const { isReady, session } = useAuth();
  const isCompany = isCompanySession(session);
  const orderQuery = useSalesOrder(params.id, Boolean(session));
  const auditQuery = useSalesOrderAuditEvents(params.id, Boolean(session) && isCompany);

  if (!isReady || orderQuery.isLoading) {
    return (
      <DashboardLayout title={tOrders("salesOrder")}>
        <div className="rounded-md border border-line bg-white p-5 text-sm">{tOrders("loadingOne")}</div>
      </DashboardLayout>
    );
  }

  if (!orderQuery.data) {
    return (
      <DashboardLayout title={tOrders("salesOrder")}>
        <div className="rounded-md border border-line bg-white p-5 text-sm text-danger">
          {tOrders("notFound")}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={orderQuery.data.code}
      description={tOrders("detailsDescription")}
    >
      <DetailPageLayout
        main={<OrderDetailsPanel order={orderQuery.data} />}
        aside={isCompany ? (
          <div className="grid gap-5">
            <ScheduleForm order={orderQuery.data} />
            <AuditTimeline events={auditQuery.data ?? []} loading={auditQuery.isLoading} />
          </div>
        ) : (
          <section className="rounded-md border border-line bg-white p-5">
            <h2 className="text-base font-semibold text-ink">{tAuth("customerReadOnly")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {tAuth("customerReadOnlyDescription")}
            </p>
          </section>
        )}
      />
    </DashboardLayout>
  );
};

export default OrderDetailsPage;
