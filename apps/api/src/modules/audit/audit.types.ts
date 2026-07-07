import { Prisma } from "@prisma/client";

export const AuditActions = {
  SalesOrderCreated: "SALES_ORDER_CREATED",
  StatusChanged: "STATUS_CHANGED",
  ScheduleChanged: "SCHEDULE_CHANGED",
  TransportChanged: "TRANSPORT_CHANGED"
} as const;

export type AuditAction = (typeof AuditActions)[keyof typeof AuditActions];

export type AuditState = Prisma.InputJsonObject | Prisma.InputJsonArray | null;

export type RecordAuditEventInput = {
  entityType: string;
  entityId: string;
  action: AuditAction;
  previousState?: AuditState;
  nextState?: AuditState;
};
