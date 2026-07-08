import { BadRequestException } from "@nestjs/common";
import { SalesOrderStatus } from "@prisma/client";
import { SalesOrdersService } from "./sales-orders.service";

const customerId = "11111111-1111-4111-8111-111111111111";
const authorizedTransportTypeId = "22222222-2222-4222-8222-222222222222";
const unauthorizedTransportTypeId = "33333333-3333-4333-8333-333333333333";
const itemId = "44444444-4444-4444-8444-444444444444";
const orderId = "55555555-5555-4555-8555-555555555555";

describe("SalesOrdersService", () => {
  const makeService = (repositoryOverrides: Record<string, jest.Mock> = {}) => {
    const repository = {
      findCustomerWithAuthorizedTransports: jest.fn().mockResolvedValue({
        id: customerId,
        authorizedTransportTypes: [
          { customerId, transportTypeId: authorizedTransportTypeId }
        ]
      }),
      findTransportType: jest.fn().mockResolvedValue({
        id: authorizedTransportTypeId,
        active: true
      }),
      findItemsByIds: jest.fn().mockResolvedValue([{ id: itemId }]),
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
      updateSchedule: jest.fn(),
      updateTransport: jest.fn(),
      ...repositoryOverrides
    };

    const auditService = {
      record: jest.fn()
    };

    return {
      service: new SalesOrdersService(repository as never, auditService as never),
      repository,
      auditService
    };
  };

  it("rejects sales order creation when the transport type is not authorized", async () => {
    const { service } = makeService({
      findTransportType: jest.fn().mockResolvedValue({
        id: unauthorizedTransportTypeId,
        active: true
      })
    });

    await expect(
      service.create({
        customerId,
        transportTypeId: unauthorizedTransportTypeId,
        items: [{ itemId, quantity: 1 }]
      })
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects status transitions outside the expected sequence", async () => {
    const { service, repository } = makeService({
      findById: jest.fn().mockResolvedValue({
        id: orderId,
        status: SalesOrderStatus.CRIADA
      })
    });

    await expect(
      service.updateStatus(orderId, { status: SalesOrderStatus.AGENDADA })
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(repository.updateStatus).not.toHaveBeenCalled();
  });
});
