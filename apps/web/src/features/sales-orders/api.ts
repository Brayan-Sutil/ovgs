import { apiFetch } from "@/lib/http";
import {
  AuditEvent,
  SalesOrder,
  SalesOrderFilters,
  SalesOrderStatus
} from "./types";

export type CreateSalesOrderPayload = {
  customerId: string;
  transportTypeId: string;
  items: Array<{
    itemId: string;
    quantity: number;
  }>;
};

export type UpdateSchedulePayload = {
  deliveryDate: string;
  deliveryWindowStart: string;
  deliveryWindowEnd: string;
  confirmed?: boolean;
};

export function listSalesOrders(filters: SalesOrderFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return apiFetch<SalesOrder[]>(`/sales-orders${query ? `?${query}` : ""}`);
}

export function getSalesOrder(id: string) {
  return apiFetch<SalesOrder>(`/sales-orders/${id}`);
}

export function createSalesOrder(payload: CreateSalesOrderPayload) {
  return apiFetch<SalesOrder>("/sales-orders", {
    method: "POST",
    body: payload
  });
}

export function updateSalesOrderStatus(id: string, status: SalesOrderStatus) {
  return apiFetch<SalesOrder>(`/sales-orders/${id}/status`, {
    method: "PATCH",
    body: { status }
  });
}

export function updateSalesOrderSchedule(id: string, payload: UpdateSchedulePayload) {
  return apiFetch<SalesOrder>(`/sales-orders/${id}/schedule`, {
    method: "PATCH",
    body: payload
  });
}

export function updateSalesOrderTransport(id: string, transportTypeId: string) {
  return apiFetch<SalesOrder>(`/sales-orders/${id}/transport`, {
    method: "PATCH",
    body: { transportTypeId }
  });
}

export function listSalesOrderAuditEvents(id: string) {
  return apiFetch<AuditEvent[]>(`/sales-orders/${id}/audit-events`);
}

export function listSchedulableOrders() {
  return apiFetch<SalesOrder[]>("/scheduling");
}
