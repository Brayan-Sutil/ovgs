"use client";

import { ArrowRight, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAuth } from "@/auth/provider";
import { isCompanySession } from "@/auth/session";
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
import { formatDate } from "@/i18n/format";
import { useAppLocale } from "@/i18n/provider";

export const OrderDetailsPanel = ({ order }: { order: SalesOrder }) => {
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const tItems = useTranslations("items");
  const tOrders = useTranslations("orders");
  const tOrderForm = useTranslations("orderForm");
  const tStatus = useTranslations("status");
  const { session } = useAuth();
  const { locale } = useAppLocale();
  const canManageOrder = isCompanySession(session);
  const updateStatus = useUpdateSalesOrderStatus(order.id);
  const updateTransport = useUpdateSalesOrderTransport(order.id);
  const [transportTypeId, setTransportTypeId] = useState(order.transportTypeId);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [transportError, setTransportError] = useState<string | null>(null);
  const authorizedTransportTypes = order.customer.authorizedTransportTypes.map(
    (authorization) => authorization.transportType
  );

  const advanceStatus = async () => {
    if (!order.nextStatus) {
      return;
    }

    setStatusError(null);
    try {
      await updateStatus.mutateAsync(order.nextStatus);
    } catch (error) {
      setStatusError(tErrors("updateStatus"));
    }
  };

  const changeTransport = async () => {
    setTransportError(null);
    try {
      await updateTransport.mutateAsync(transportTypeId);
    } catch (error) {
      setTransportError(tErrors("updateTransport"));
    }
  };

  return (
    <div className="grid min-w-0 max-w-full gap-5">
      <section className="min-w-0 rounded-md border border-line bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-medium text-slate-500">{tOrders("salesOrder")}</div>
            <h2 className="break-words text-2xl font-bold text-ink">{order.code}</h2>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <dl className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="text-xs uppercase text-slate-500">{tOrders("customer")}</dt>
            <dd className="mt-1 break-words text-sm font-semibold text-ink">{order.customer.name}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs uppercase text-slate-500">{tOrders("currentTransport")}</dt>
            <dd className="mt-1 break-words text-sm font-semibold text-ink">{order.transportType.name}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs uppercase text-slate-500">{tOrders("deliveryDate")}</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">
              {order.deliveryDate ? formatDate(order.deliveryDate, locale) : tCommon("notAvailable")}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs uppercase text-slate-500">{tOrders("window")}</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">
              {order.deliveryWindowStart && order.deliveryWindowEnd
                ? `${order.deliveryWindowStart} - ${order.deliveryWindowEnd}`
                : "-"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="min-w-0 rounded-md border border-line bg-white p-5">
        <h3 className="text-base font-semibold text-ink">{tItems("title")}</h3>

        <div className="mt-4 divide-y divide-line rounded-md border border-line md:hidden">
          {order.items.map((orderItem) => (
            <div key={orderItem.itemId} className="grid gap-3 p-3">
              <div className="min-w-0">
                <div className="break-words text-sm font-semibold text-ink">
                  {orderItem.item.name}
                </div>
                <div className="mt-1 break-words text-xs font-semibold uppercase text-slate-500">
                  {orderItem.item.sku}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-xs font-semibold uppercase text-slate-500">
                  {tOrderForm("shortQuantity")}
                </span>
                <span className="font-semibold text-ink">{orderItem.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 hidden overflow-x-auto rounded-md border border-line md:block">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">{tItems("item")}</th>
                <th className="px-3 py-2">{tOrderForm("shortQuantity")}</th>
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

      {canManageOrder && order.nextStatus ? (
        <ConfirmDialog
          title={tOrders("advanceTo", { status: tStatus(order.nextStatus) })}
          description={tOrders("transitionDescription")}
          confirmLabel={tOrders("advanceStatus")}
          loading={updateStatus.isPending}
          onConfirm={advanceStatus}
        />
      ) : null}

      {statusError ? (
        <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-danger">{statusError}</div>
      ) : null}

      {canManageOrder ? (
        <section className="min-w-0 rounded-md border border-line bg-white p-5">
          <h3 className="flex items-center gap-2 text-base font-semibold text-ink">
            <Truck size={18} aria-hidden />
            {tOrders("transport")}
          </h3>
          <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
            <FormField label={tOrders("authorizedType")} error={transportError ?? undefined}>
              <Select
                aria-invalid={Boolean(transportError)}
                value={transportTypeId}
                onChange={(event) => {
                  setTransportTypeId(event.target.value);
                  setTransportError(null);
                }}
              >
                {authorizedTransportTypes.map((transportType) => (
                  <option key={transportType.id} value={transportType.id}>
                    {transportType.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <div className="flex min-w-0 items-end">
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                disabled={transportTypeId === order.transportTypeId || updateTransport.isPending}
                onClick={changeTransport}
              >
                <ArrowRight size={16} aria-hidden />
                {tOrders("change")}
              </Button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};
