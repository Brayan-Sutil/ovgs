export const salesOrderStatuses = [
  "CRIADA",
  "PLANEJADA",
  "AGENDADA",
  "EM_TRANSPORTE",
  "ENTREGUE"
] as const;

export type SalesOrderStatus = (typeof salesOrderStatuses)[number];

export type TransportType = {
  id: string;
  name: string;
  active: boolean;
};

export type Customer = {
  id: string;
  name: string;
  document: string;
  email?: string | null;
  authorizedTransportTypes: Array<{
    customerId: string;
    transportTypeId: string;
    transportType: TransportType;
  }>;
};

export type Item = {
  id: string;
  sku: string;
  name: string;
  description?: string | null;
  active: boolean;
};

export type SalesOrderItem = {
  itemId: string;
  quantity: number;
  item: Item;
};

export type SalesOrder = {
  id: string;
  code: string;
  status: SalesOrderStatus;
  customerId: string;
  transportTypeId: string;
  deliveryDate?: string | null;
  deliveryWindowStart?: string | null;
  deliveryWindowEnd?: string | null;
  scheduleConfirmedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  transportType: TransportType;
  items: SalesOrderItem[];
  nextStatus?: SalesOrderStatus | null;
};

export type AuditEvent = {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  previousState?: unknown;
  nextState?: unknown;
  createdAt: string;
};

export type SalesOrderFilters = {
  status?: SalesOrderStatus;
  customerId?: string;
  transportTypeId?: string;
  dateFrom?: string;
  dateTo?: string;
};
