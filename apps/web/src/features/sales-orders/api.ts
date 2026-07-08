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

export const listSalesOrders = (filters: SalesOrderFilters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return apiFetch<SalesOrder[]>(`/sales-orders${query ? `?${query}` : ""}`);
};

export const getSalesOrder = (id: string) => {
  return apiFetch<SalesOrder>(`/sales-orders/${id}`);
};

export const createSalesOrder = (payload: CreateSalesOrderPayload) => {
  return apiFetch<SalesOrder>("/sales-orders", {
    method: "POST",
    body: payload
  });
};

export const updateSalesOrderStatus = (id: string, status: SalesOrderStatus) => {
  return apiFetch<SalesOrder>(`/sales-orders/${id}/status`, {
    method: "PATCH",
    body: { status }
  });
};

export const updateSalesOrderSchedule = (id: string, payload: UpdateSchedulePayload) => {
  return apiFetch<SalesOrder>(`/sales-orders/${id}/schedule`, {
    method: "PATCH",
    body: payload
  });
};

export const updateSalesOrderTransport = (id: string, transportTypeId: string) => {
  return apiFetch<SalesOrder>(`/sales-orders/${id}/transport`, {
    method: "PATCH",
    body: { transportTypeId }
  });
};

export const listSalesOrderAuditEvents = (id: string) => {
  return apiFetch<AuditEvent[]>(`/sales-orders/${id}/audit-events`);
};

export const listSchedulableOrders = () => {
  return apiFetch<SalesOrder[]>("/scheduling");
};
