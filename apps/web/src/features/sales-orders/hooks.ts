import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSalesOrder,
  getSalesOrder,
  listSalesOrderAuditEvents,
  listSalesOrders,
  listSchedulableOrders,
  updateSalesOrderSchedule,
  updateSalesOrderStatus,
  updateSalesOrderTransport
} from "./api";
import { SalesOrderFilters } from "./types";

export function useSalesOrders(filters: SalesOrderFilters = {}) {
  return useQuery({
    queryKey: ["sales-orders", filters],
    queryFn: () => listSalesOrders(filters)
  });
}

export function useSchedulableOrders() {
  return useQuery({
    queryKey: ["scheduling"],
    queryFn: listSchedulableOrders
  });
}

export function useSalesOrder(id: string) {
  return useQuery({
    queryKey: ["sales-order", id],
    queryFn: () => getSalesOrder(id),
    enabled: Boolean(id)
  });
}

export function useSalesOrderAuditEvents(id: string) {
  return useQuery({
    queryKey: ["sales-order-audit", id],
    queryFn: () => listSalesOrderAuditEvents(id),
    enabled: Boolean(id)
  });
}

export function useCreateSalesOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSalesOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    }
  });
}

export function useUpdateSalesOrderStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: Parameters<typeof updateSalesOrderStatus>[1]) =>
      updateSalesOrderStatus(id, status),
    onSuccess: () => invalidateSalesOrder(queryClient, id)
  });
}

export function useUpdateSalesOrderSchedule(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateSalesOrderSchedule>[1]) =>
      updateSalesOrderSchedule(id, payload),
    onSuccess: () => invalidateSalesOrder(queryClient, id)
  });
}

export function useUpdateSalesOrderTransport(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transportTypeId: string) => updateSalesOrderTransport(id, transportTypeId),
    onSuccess: () => invalidateSalesOrder(queryClient, id)
  });
}

function invalidateSalesOrder(queryClient: ReturnType<typeof useQueryClient>, id: string) {
  void queryClient.invalidateQueries({ queryKey: ["sales-order", id] });
  void queryClient.invalidateQueries({ queryKey: ["sales-order-audit", id] });
  void queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
  void queryClient.invalidateQueries({ queryKey: ["scheduling"] });
}
