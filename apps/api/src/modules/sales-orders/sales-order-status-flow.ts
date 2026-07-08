import { SalesOrderStatus } from "@prisma/client";

export const salesOrderStatusSequence: SalesOrderStatus[] = [
  SalesOrderStatus.CRIADA,
  SalesOrderStatus.PLANEJADA,
  SalesOrderStatus.AGENDADA,
  SalesOrderStatus.EM_TRANSPORTE,
  SalesOrderStatus.ENTREGUE
];

export const canTransitionSalesOrderStatus = (
  currentStatus: SalesOrderStatus,
  nextStatus: SalesOrderStatus
) => {
  const currentIndex = salesOrderStatusSequence.indexOf(currentStatus);
  const nextIndex = salesOrderStatusSequence.indexOf(nextStatus);

  return nextIndex === currentIndex + 1;
};

export const getNextSalesOrderStatus = (currentStatus: SalesOrderStatus) => {
  const currentIndex = salesOrderStatusSequence.indexOf(currentStatus);
  return salesOrderStatusSequence[currentIndex + 1] ?? null;
};
