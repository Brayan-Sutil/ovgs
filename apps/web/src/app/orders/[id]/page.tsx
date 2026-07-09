"use client";

import { useTranslations } from "next-intl";
import { AuditTimeline } from "@/components/organisms/AuditTimeline";
import { OrderDetailsPanel } from "@/components/organisms/OrderDetailsPanel";
import { ScheduleForm } from "@/components/organisms/ScheduleForm";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { DetailPageLayout } from "@/components/templates/DetailPageLayout";
import { useSalesOrder, useSalesOrderAuditEvents } from "@/features/sales-orders/hooks";

const OrderDetailsPage = ({ params }: { params: { id: string } }) => {
  const tOrders = useTranslations("orders");
  const orderQuery = useSalesOrder(params.id);
  const auditQuery = useSalesOrderAuditEvents(params.id);

  if (orderQuery.isLoading) {
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
        aside={
          <div className="grid gap-5">
            <ScheduleForm order={orderQuery.data} />
            <AuditTimeline events={auditQuery.data ?? []} loading={auditQuery.isLoading} />
          </div>
        }
      />
    </DashboardLayout>
  );
};

export default OrderDetailsPage;
