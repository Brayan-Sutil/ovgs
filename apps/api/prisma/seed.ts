import { Prisma, PrismaClient, SalesOrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.transportType.updateMany({
    where: { name: "Caminhao" },
    data: { name: "Caminhão" }
  });

  const caminhao = await prisma.transportType.upsert({
    where: { name: "Caminhão" },
    update: { active: true },
    create: { name: "Caminhão" }
  });

  const carreta = await prisma.transportType.upsert({
    where: { name: "Carreta" },
    update: { active: true },
    create: { name: "Carreta" }
  });

  await prisma.transportType.upsert({
    where: { name: "Bi-truck" },
    update: { active: true },
    create: { name: "Bi-truck" }
  });

  const cliente = await prisma.customer.upsert({
    where: { document: "12345678000199" },
    update: { name: "Acme Distribuidora", email: "operacoes@acme.test" },
    create: {
      name: "Acme Distribuidora",
      document: "12345678000199",
      email: "operacoes@acme.test"
    }
  });

  await prisma.customerTransportType.deleteMany({
    where: { customerId: cliente.id }
  });

  await prisma.customerTransportType.createMany({
    data: [
      { customerId: cliente.id, transportTypeId: caminhao.id },
      { customerId: cliente.id, transportTypeId: carreta.id }
    ]
  });

  const itemA = await prisma.item.upsert({
    where: { sku: "SKU-001" },
    update: { name: "Produto acabado A", active: true },
    create: { sku: "SKU-001", name: "Produto acabado A" }
  });

  const itemB = await prisma.item.upsert({
    where: { sku: "SKU-002" },
    update: { name: "Produto acabado B", active: true },
    create: { sku: "SKU-002", name: "Produto acabado B" }
  });

  const order = await prisma.salesOrder.upsert({
    where: { code: "OV-DEMO-001" },
    update: {
      status: SalesOrderStatus.PLANEJADA,
      customerId: cliente.id,
      transportTypeId: caminhao.id
    },
    create: {
      code: "OV-DEMO-001",
      status: SalesOrderStatus.PLANEJADA,
      customerId: cliente.id,
      transportTypeId: caminhao.id,
      items: {
        create: [
          { itemId: itemA.id, quantity: 10 },
          { itemId: itemB.id, quantity: 5 }
        ]
      }
    }
  });

  await prisma.auditEvent.deleteMany({
    where: {
      entityType: "SalesOrder",
      entityId: order.id,
      action: "SALES_ORDER_CREATED"
    }
  });

  await prisma.auditEvent.create({
    data: {
      entityType: "SalesOrder",
      entityId: order.id,
      action: "SALES_ORDER_CREATED",
      previousState: Prisma.JsonNull,
      nextState: {
        code: order.code,
        status: order.status,
        customerId: order.customerId,
        transportTypeId: order.transportTypeId
      }
    }
  });
};

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
