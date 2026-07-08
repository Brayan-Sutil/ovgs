import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class SharingRepository {
  constructor(private readonly prisma: PrismaService) {}

  createSalesOrderLink(input: {
    token: string;
    salesOrderId: string;
    createdBy: string;
    expiresAt?: Date;
  }) {
    return this.prisma.shareLink.create({
      data: {
        token: input.token,
        entityType: "SalesOrder",
        entityId: input.salesOrderId,
        createdBy: input.createdBy,
        expiresAt: input.expiresAt
      }
    });
  }

  findByToken(token: string) {
    return this.prisma.shareLink.findUnique({
      where: { token }
    });
  }
}
