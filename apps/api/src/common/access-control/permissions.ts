import { AccessAction, AccessModule, AccessPolicy, UserRole } from "./access-control.types";

const allModules = Object.values(AccessModule);
const allActions = Object.values(AccessAction);

const modulePermissions: Record<UserRole, Partial<Record<AccessModule, AccessAction[]>>> = {
  [UserRole.MasterAdmin]: Object.fromEntries(
    allModules.map((moduleName) => [moduleName, allActions])
  ) as Record<AccessModule, AccessAction[]>,
  [UserRole.Operations]: {
    [AccessModule.Customers]: [AccessAction.Read],
    [AccessModule.TransportTypes]: [AccessAction.Read],
    [AccessModule.Items]: [AccessAction.Read],
    [AccessModule.SalesOrders]: [
      AccessAction.Read,
      AccessAction.Create,
      AccessAction.Update,
      AccessAction.Share
    ],
    [AccessModule.Scheduling]: [AccessAction.Read, AccessAction.Update],
    [AccessModule.Audit]: [AccessAction.Read],
    [AccessModule.Sharing]: [AccessAction.Read]
  },
  [UserRole.Viewer]: {
    [AccessModule.Customers]: [AccessAction.Read],
    [AccessModule.TransportTypes]: [AccessAction.Read],
    [AccessModule.Items]: [AccessAction.Read],
    [AccessModule.SalesOrders]: [AccessAction.Read],
    [AccessModule.Scheduling]: [AccessAction.Read],
    [AccessModule.Audit]: [AccessAction.Read],
    [AccessModule.Sharing]: [AccessAction.Read]
  }
};

export const hasPermission = (role: UserRole, policy: AccessPolicy) => {
  return modulePermissions[role][policy.module]?.includes(policy.action) ?? false;
};

export const parseUserRole = (value: string | string[] | undefined) => {
  const role = Array.isArray(value) ? value[0] : value;

  if (!role || !Object.values(UserRole).includes(role as UserRole)) {
    return null;
  }

  return role as UserRole;
};
