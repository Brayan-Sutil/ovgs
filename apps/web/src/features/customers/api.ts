import { apiFetch } from "@/lib/http";
import { Customer } from "@/features/sales-orders/types";

export type CustomerPayload = {
  name: string;
  document: string;
  email?: string;
  authorizedTransportTypeIds?: string[];
};

export const listCustomers = () => {
  return apiFetch<Customer[]>("/customers");
};

export const createCustomer = (payload: CustomerPayload) => {
  return apiFetch<Customer>("/customers", {
    method: "POST",
    body: payload
  });
};

export const updateCustomer = (id: string, payload: Partial<CustomerPayload>) => {
  return apiFetch<Customer>(`/customers/${id}`, {
    method: "PATCH",
    body: payload
  });
};
