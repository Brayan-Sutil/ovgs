import { Injectable } from "@nestjs/common";
import { Prisma, SalesOrderStatus } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateSalesOrderDto } from "./dto/create-sales-order.dto";
import { ListSalesOrdersQueryDto } from "./dto/list-sales-orders-query.dto";

export const salesOrderInclude = {
  customer: {
    include: {
      authorizedTransportTypes: {
        include: {
          transportType: true
        }
      }
    }
  },
  transportType: true,
  items: {
    include: {
      item: true
    }
  }
} satisfies Prisma.SalesOrderInclude;

@Injectable()
export class SalesOrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findCustomerWithAuthorizedTransports(customerId: string) {
    return this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        authorizedTransportTypes: true
      }
    });
  }

  findTransportType(transportTypeId: string) {
    return this.prisma.transportType.findUnique({
      where: { id: transportTypeId }
    });
  }

  findItemsByIds(itemIds: string[]) {
    return this.prisma.item.findMany({
      where: {
        id: { in: itemIds },
        active: true
      }
    });
  }

  create(code: string, dto: CreateSalesOrderDto) {
    return this.prisma.salesOrder.create({
      data: {
        code,
        customerId: dto.customerId,
        transportTypeId: dto.transportTypeId,
        items: {
          create: dto.items.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity
          }))
        }
      },
      include: salesOrderInclude
    });
  }

  findAll(query: ListSalesOrdersQueryDto) {
    const where: Prisma.SalesOrderWhereInput = {
      status: query.status,
      customerId: query.customerId,
      transportTypeId: query.transportTypeId,
      createdAt: buildDateRange(query.dateFrom, query.dateTo)
    };

    return this.prisma.salesOrder.findMany({
      where,
      include: salesOrderInclude,
      orderBy: { createdAt: "desc" }
    });
  }

  findById(id: string) {
    return this.prisma.salesOrder.findUnique({
      where: { id },
      include: salesOrderInclude
    });
  }

  updateStatus(id: string, status: SalesOrderStatus) {
    return this.prisma.salesOrder.update({
      where: { id },
      data: { status },
      include: salesOrderInclude
    });
  }

  updateSchedule(
    id: string,
    data: {
      deliveryDate: Date;
      deliveryWindowStart: string;
      deliveryWindowEnd: string;
      scheduleConfirmedAt?: Date | null;
      status?: SalesOrderStatus;
    }
  ) {
    return this.prisma.salesOrder.update({
      where: { id },
      data,
      include: salesOrderInclude
    });
  }

  updateTransport(id: string, transportTypeId: string) {
    return this.prisma.salesOrder.update({
      where: { id },
      data: { transportTypeId },
      include: salesOrderInclude
    });
  }
}

const buildDateRange = (dateFrom?: string, dateTo?: string) => {
  if (!dateFrom && !dateTo) {
    return undefined;
  }

  return {
    gte: dateFrom ? new Date(dateFrom) : undefined,
    lte: dateTo ? new Date(dateTo) : undefined
  };
};
