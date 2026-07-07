import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCustomer, listCustomers, updateCustomer } from "./api";

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: listCustomers
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customers"] });
    }
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateCustomer>[1] }) =>
      updateCustomer(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customers"] });
    }
  });
}
