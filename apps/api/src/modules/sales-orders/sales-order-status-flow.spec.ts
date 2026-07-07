import { SalesOrderStatus } from "@prisma/client";
import {
  canTransitionSalesOrderStatus,
  getNextSalesOrderStatus
} from "./sales-order-status-flow";

describe("salesOrderStatusFlow", () => {
  it("allows only the next status in the operational sequence", () => {
    expect(
      canTransitionSalesOrderStatus(
        SalesOrderStatus.CRIADA,
        SalesOrderStatus.PLANEJADA
      )
    ).toBe(true);

    expect(
      canTransitionSalesOrderStatus(
        SalesOrderStatus.CRIADA,
        SalesOrderStatus.AGENDADA
      )
    ).toBe(false);
  });

  it("returns null when the order is already delivered", () => {
    expect(getNextSalesOrderStatus(SalesOrderStatus.ENTREGUE)).toBeNull();
  });
});
