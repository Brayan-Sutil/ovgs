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

export const useSalesOrders = (filters: SalesOrderFilters = {}, enabled = true) => {
  return useQuery({
    queryKey: ["sales-orders", filters],
    queryFn: () => listSalesOrders(filters),
    enabled
  });
};

export const useSchedulableOrders = (enabled = true) => {
  return useQuery({
    queryKey: ["scheduling"],
    queryFn: listSchedulableOrders,
    enabled
  });
};

export const useSalesOrder = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["sales-order", id],
    queryFn: () => getSalesOrder(id),
    enabled: Boolean(id) && enabled
  });
};

export const useSalesOrderAuditEvents = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["sales-order-audit", id],
    queryFn: () => listSalesOrderAuditEvents(id),
    enabled: Boolean(id) && enabled
  });
};

export const useCreateSalesOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSalesOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    }
  });
};

export const useUpdateSalesOrderStatus = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: Parameters<typeof updateSalesOrderStatus>[1]) =>
      updateSalesOrderStatus(id, status),
    onSuccess: () => invalidateSalesOrder(queryClient, id)
  });
};

export const useUpdateSalesOrderSchedule = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateSalesOrderSchedule>[1]) =>
      updateSalesOrderSchedule(id, payload),
    onSuccess: () => invalidateSalesOrder(queryClient, id)
  });
};

export const useUpdateSalesOrderTransport = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transportTypeId: string) => updateSalesOrderTransport(id, transportTypeId),
    onSuccess: () => invalidateSalesOrder(queryClient, id)
  });
};

const invalidateSalesOrder = (queryClient: ReturnType<typeof useQueryClient>, id: string) => {
  void queryClient.invalidateQueries({ queryKey: ["sales-order", id] });
  void queryClient.invalidateQueries({ queryKey: ["sales-order-audit", id] });
  void queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
  void queryClient.invalidateQueries({ queryKey: ["scheduling"] });
};
