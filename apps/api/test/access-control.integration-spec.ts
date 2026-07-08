import { INestApplication } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import request = require("supertest");
import { AccessControlGuard } from "../src/common/access-control/access-control.guard";
import { UserRole } from "../src/common/access-control/access-control.types";
import { CustomersController } from "../src/modules/customers/customers.controller";
import { CustomersService } from "../src/modules/customers/customers.service";
import { HealthController } from "../src/modules/health/health.controller";
import { HealthService } from "../src/modules/health/health.service";
import { SharingController } from "../src/modules/sharing/sharing.controller";
import { SharingService } from "../src/modules/sharing/sharing.service";

describe("access control integration", () => {
  let app: INestApplication;

  const customersService = {
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({
      id: "customer-1",
      name: "Cliente Teste",
      document: "12345678000199"
    }),
    update: jest.fn()
  };

  const healthService = {
    check: jest.fn().mockResolvedValue({
      status: "ok",
      database: "ok"
    })
  };

  const sharingService = {
    createSalesOrderShareLink: jest.fn().mockResolvedValue({
      token: "share-token",
      url: "/shared/sales-orders/share-token"
    }),
    getSharedSalesOrder: jest.fn().mockResolvedValue({
      id: "sales-order-1",
      code: "OV-TESTE"
    })
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CustomersController, HealthController, SharingController],
      providers: [
        { provide: CustomersService, useValue: customersService },
        { provide: HealthService, useValue: healthService },
        { provide: SharingService, useValue: sharingService },
        {
          provide: APP_GUARD,
          useClass: AccessControlGuard
        }
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("keeps the health connection endpoint public", async () => {
    await request(app.getHttpServer()).get("/health").expect(200, {
      status: "ok",
      database: "ok"
    });
  });

  it("requires a valid role to access protected modules", async () => {
    await request(app.getHttpServer()).get("/customers").expect(401);

    await request(app.getHttpServer())
      .get("/customers")
      .set("x-user-role", UserRole.Viewer)
      .expect(200, []);
  });

  it("blocks viewer CRUD writes and allows master admin writes", async () => {
    await request(app.getHttpServer())
      .post("/customers")
      .set("x-user-role", UserRole.Viewer)
      .send({ name: "Cliente Teste", document: "12345678000199" })
      .expect(403);

    await request(app.getHttpServer())
      .post("/customers")
      .set("x-user-role", UserRole.MasterAdmin)
      .set("x-user-id", "master-admin")
      .send({ name: "Cliente Teste", document: "12345678000199" })
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBe("customer-1");
      });
  });

  it("allows master admin to share a sales order and keeps token access public", async () => {
    await request(app.getHttpServer())
      .post("/sales-orders/sales-order-1/share")
      .set("x-user-role", UserRole.MasterAdmin)
      .set("x-user-id", "master-admin")
      .send({})
      .expect(201)
      .expect(({ body }) => {
        expect(body.url).toBe("/shared/sales-orders/share-token");
      });

    await request(app.getHttpServer())
      .get("/shared/sales-orders/share-token")
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe("OV-TESTE");
      });
  });
});
