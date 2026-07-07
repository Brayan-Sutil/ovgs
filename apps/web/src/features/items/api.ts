import { apiFetch } from "@/lib/http";
import { Item } from "@/features/sales-orders/types";

export type ItemPayload = {
  sku: string;
  name: string;
  description?: string;
  active?: boolean;
};

export function listItems() {
  return apiFetch<Item[]>("/items");
}

export function createItem(payload: ItemPayload) {
  return apiFetch<Item>("/items", {
    method: "POST",
    body: payload
  });
}
