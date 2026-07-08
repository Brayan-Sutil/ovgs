import { HealthService } from "./health.service";

describe("HealthService", () => {
  it("checks database connectivity", async () => {
    const prisma = {
      $queryRaw: jest.fn().mockResolvedValue([{ result: 1 }])
    };
    const service = new HealthService(prisma as never);

    await expect(service.check()).resolves.toMatchObject({
      status: "ok",
      database: "ok"
    });
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
  });
});
