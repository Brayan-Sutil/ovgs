import { NotFoundException } from "@nestjs/common";
import { SharingService } from "./sharing.service";

describe("SharingService", () => {
  const salesOrderId = "11111111-1111-4111-8111-111111111111";
  const token = "22222222-2222-4222-8222-222222222222";

  const makeService = (overrides: Record<string, jest.Mock> = {}) => {
    const sharingRepository = {
      createSalesOrderLink: jest.fn().mockResolvedValue({
        token,
        entityId: salesOrderId,
        expiresAt: null
      }),
      findByToken: jest.fn().mockResolvedValue({
        token,
        entityType: "SalesOrder",
        entityId: salesOrderId,
        expiresAt: null
      }),
      ...overrides
    };

    const salesOrdersService = {
      findById: jest.fn().mockResolvedValue({ id: salesOrderId, code: "OV-TESTE" })
    };

    return {
      service: new SharingService(sharingRepository as never, salesOrdersService as never),
      sharingRepository,
      salesOrdersService
    };
  };

  it("creates a share link only for an existing sales order", async () => {
    const { service, salesOrdersService, sharingRepository } = makeService();

    await expect(
      service.createSalesOrderShareLink(salesOrderId, "master-admin", {})
    ).resolves.toMatchObject({
      token,
      url: `/shared/sales-orders/${token}`
    });

    expect(salesOrdersService.findById).toHaveBeenCalledWith(salesOrderId);
    expect(sharingRepository.createSalesOrderLink).toHaveBeenCalledWith(
      expect.objectContaining({ salesOrderId, createdBy: "master-admin" })
    );
  });

  it("rejects expired share links", async () => {
    const { service } = makeService({
      findByToken: jest.fn().mockResolvedValue({
        token,
        entityType: "SalesOrder",
        entityId: salesOrderId,
        expiresAt: new Date(Date.now() - 1_000)
      })
    });

    await expect(service.getSharedSalesOrder(token)).rejects.toBeInstanceOf(NotFoundException);
  });
});
