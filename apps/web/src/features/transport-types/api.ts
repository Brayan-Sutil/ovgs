import { apiFetch } from "@/lib/http";
import { TransportType } from "@/features/sales-orders/types";

export type TransportTypePayload = {
  name: string;
  active?: boolean;
};

export function listTransportTypes() {
  return apiFetch<TransportType[]>("/transport-types");
}

export function createTransportType(payload: TransportTypePayload) {
  return apiFetch<TransportType>("/transport-types", {
    method: "POST",
    body: payload
  });
}

export function updateTransportType(id: string, payload: Partial<TransportTypePayload>) {
  return apiFetch<TransportType>(`/transport-types/${id}`, {
    method: "PATCH",
    body: payload
  });
}
