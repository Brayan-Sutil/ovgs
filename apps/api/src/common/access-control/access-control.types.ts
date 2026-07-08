export enum UserRole {
  MasterAdmin = "MASTER_ADMIN",
  Operations = "OPERATIONS",
  Viewer = "VIEWER"
}

export enum AccessModule {
  Customers = "CUSTOMERS",
  TransportTypes = "TRANSPORT_TYPES",
  Items = "ITEMS",
  SalesOrders = "SALES_ORDERS",
  Scheduling = "SCHEDULING",
  Audit = "AUDIT",
  Sharing = "SHARING"
}

export enum AccessAction {
  Read = "READ",
  Create = "CREATE",
  Update = "UPDATE",
  Share = "SHARE"
}

export type AccessPolicy = {
  module: AccessModule;
  action: AccessAction;
};

export type AuthenticatedUser = {
  id: string;
  role: UserRole;
};
