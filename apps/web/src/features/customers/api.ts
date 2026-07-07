import { apiFetch } from "@/lib/http";
import { Customer } from "@/features/sales-orders/types";

export type CustomerPayload = {
  name: string;
  document: string;
  email?: string;
  authorizedTransportTypeIds?: string[];
};

export function listCustomers() {
  return apiFetch<Customer[]>("/customers");
}

export function createCustomer(payload: CustomerPayload) {
  return apiFetch<Customer>("/customers", {
    method: "POST",
    body: payload
  });
}

export function updateCustomer(id: string, payload: Partial<CustomerPayload>) {
  return apiFetch<Customer>(`/customers/${id}`, {
    method: "PATCH",
    body: payload
  });
}
