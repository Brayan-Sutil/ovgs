"use client";

import { AuditTimeline } from "@/components/organisms/AuditTimeline";
import { OrderDetailsPanel } from "@/components/organisms/OrderDetailsPanel";
import { ScheduleForm } from "@/components/organisms/ScheduleForm";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { DetailPageLayout } from "@/components/templates/DetailPageLayout";
import { useSalesOrder, useSalesOrderAuditEvents } from "@/features/sales-orders/hooks";

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const orderQuery = useSalesOrder(params.id);
  const auditQuery = useSalesOrderAuditEvents(params.id);

  if (orderQuery.isLoading) {
    return (
      <DashboardLayout title="Ordem de Venda">
        <div className="rounded-md border border-line bg-white p-5 text-sm">Carregando ordem...</div>
      </DashboardLayout>
    );
  }

  if (!orderQuery.data) {
    return (
      <DashboardLayout title="Ordem de Venda">
        <div className="rounded-md border border-line bg-white p-5 text-sm text-danger">
          Ordem nao encontrada.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={orderQuery.data.code}
      description="Detalhe, status, agendamento, transporte e auditoria."
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
}
