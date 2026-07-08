"use client";

import { ArrowRight, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/atoms/Button";
import { Select } from "@/components/atoms/Select";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { FormField } from "@/components/molecules/FormField";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import {
  useUpdateSalesOrderStatus,
  useUpdateSalesOrderTransport
} from "@/features/sales-orders/hooks";
import { SalesOrder } from "@/features/sales-orders/types";

export const OrderDetailsPanel = ({ order }: { order: SalesOrder }) => {
  const updateStatus = useUpdateSalesOrderStatus(order.id);
  const updateTransport = useUpdateSalesOrderTransport(order.id);
  const [transportTypeId, setTransportTypeId] = useState(order.transportTypeId);
  const [message, setMessage] = useState<string | null>(null);
  const authorizedTransportTypes = order.customer.authorizedTransportTypes.map(
    (authorization) => authorization.transportType
  );

  const advanceStatus = async () => {
    if (!order.nextStatus) {
      return;
    }

    setMessage(null);
    try {
      await updateStatus.mutateAsync(order.nextStatus);
      toast.success("Status atualizado com sucesso.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar o status.");
    }
  };

  const changeTransport = async () => {
    setMessage(null);
    try {
      await updateTransport.mutateAsync(transportTypeId);
      toast.success("Transporte atualizado com sucesso.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nao foi possivel alterar o transporte.");
    }
  };

  return (
    <div className="grid gap-5">
      <section className="rounded-md border border-line bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-sm font-medium text-slate-500">Ordem de Venda</div>
            <h2 className="text-2xl font-bold text-ink">{order.code}</h2>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-slate-500">Cliente</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">{order.customer.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Transporte atual</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">{order.transportType.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Data de entrega</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">
              {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString("pt-BR") : "-"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Janela</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">
              {order.deliveryWindowStart && order.deliveryWindowEnd
                ? `${order.deliveryWindowStart} - ${order.deliveryWindowEnd}`
                : "-"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-md border border-line bg-white p-5">
        <h3 className="text-base font-semibold text-ink">Itens</h3>
        <div className="mt-4 overflow-hidden rounded-md border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Qtd.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {order.items.map((orderItem) => (
                <tr key={orderItem.itemId}>
                  <td className="px-3 py-2 font-semibold">{orderItem.item.sku}</td>
                  <td className="px-3 py-2">{orderItem.item.name}</td>
                  <td className="px-3 py-2">{orderItem.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {order.nextStatus ? (
        <ConfirmDialog
          title={`Avancar para ${order.nextStatus.replace("_", " ")}`}
          description="A transicao sera validada pela API antes de persistir a alteracao."
          confirmLabel="Avancar status"
          loading={updateStatus.isPending}
          onConfirm={advanceStatus}
        />
      ) : null}

      <section className="rounded-md border border-line bg-white p-5">
        <h3 className="flex items-center gap-2 text-base font-semibold text-ink">
          <Truck size={18} aria-hidden />
          Transporte
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <FormField label="Tipo autorizado">
            <Select value={transportTypeId} onChange={(event) => setTransportTypeId(event.target.value)}>
              {authorizedTransportTypes.map((transportType) => (
                <option key={transportType.id} value={transportType.id}>
                  {transportType.name}
                </option>
              ))}
            </Select>
          </FormField>
          <div className="flex items-end">
            <Button
              variant="secondary"
              disabled={transportTypeId === order.transportTypeId || updateTransport.isPending}
              onClick={changeTransport}
            >
              <ArrowRight size={16} aria-hidden />
              Alterar
            </Button>
          </div>
        </div>
      </section>

      {message ? <div className="rounded-md bg-surface p-3 text-sm text-slate-700">{message}</div> : null}
    </div>
  );
};
