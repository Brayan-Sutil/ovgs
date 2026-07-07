import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { SalesOrderStatus } from "@prisma/client";
import request = require("supertest");
import { AuditService } from "../src/modules/audit/audit.service";
import { SalesOrdersController } from "../src/modules/sales-orders/sales-orders.controller";
import { SalesOrdersRepository } from "../src/modules/sales-orders/sales-orders.repository";
import { SalesOrdersService } from "../src/modules/sales-orders/sales-orders.service";

const customerId = "11111111-1111-4111-8111-111111111111";
const transportTypeId = "22222222-2222-4222-8222-222222222222";
const itemId = "44444444-4444-4444-8444-444444444444";
const orderId = "55555555-5555-4555-8555-555555555555";

describe("SalesOrdersController integration", () => {
  let app: INestApplication;
  const repository = {
    findCustomerWithAuthorizedTransports: jest.fn(),
    findTransportType: jest.fn(),
    findItemsByIds: jest.fn(),
    create: jest.fn()
  };

  const auditService = {
    record: jest.fn()
  };

  beforeEach(async () => {
    repository.findCustomerWithAuthorizedTransports.mockResolvedValue({
      id: customerId,
      authorizedTransportTypes: [{ customerId, transportTypeId }]
    });
    repository.findTransportType.mockResolvedValue({ id: transportTypeId, active: true });
    repository.findItemsByIds.mockResolvedValue([{ id: itemId }]);
    repository.create.mockResolvedValue({
      id: orderId,
      code: "OV-TESTE",
      customerId,
      transportTypeId,
      status: SalesOrderStatus.CRIADA,
      deliveryDate: null,
      deliveryWindowStart: null,
      deliveryWindowEnd: null,
      scheduleConfirmedAt: null,
      customer: { id: customerId, name: "Cliente Teste" },
      transportType: { id: transportTypeId, name: "Caminhao" },
      items: [{ itemId, quantity: 2, item: { id: itemId, sku: "SKU-001" } }]
    });

    const moduleRef = await Test.createTestingModule({
      controllers: [SalesOrdersController],
      providers: [
        SalesOrdersService,
        { provide: SalesOrdersRepository, useValue: repository },
        { provide: AuditService, useValue: auditService }
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  it("creates a sales order and records the audit event", async () => {
    await request(app.getHttpServer())
      .post("/sales-orders")
      .send({
        customerId,
        transportTypeId,
        items: [{ itemId, quantity: 2 }]
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBe(orderId);
        expect(body.status).toBe(SalesOrderStatus.CRIADA);
      });

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(auditService.record).toHaveBeenCalledTimes(1);
  });
});
