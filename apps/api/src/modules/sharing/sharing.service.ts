import { randomUUID } from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { SalesOrdersService } from "../sales-orders/sales-orders.service";
import { CreateShareLinkDto } from "./dto/create-share-link.dto";
import { SharingRepository } from "./sharing.repository";

@Injectable()
export class SharingService {
  constructor(
    private readonly sharingRepository: SharingRepository,
    private readonly salesOrdersService: SalesOrdersService
  ) {}

  async createSalesOrderShareLink(
    salesOrderId: string,
    createdBy: string,
    dto: CreateShareLinkDto
  ) {
    await this.salesOrdersService.findById(salesOrderId);

    const shareLink = await this.sharingRepository.createSalesOrderLink({
      token: randomUUID(),
      salesOrderId,
      createdBy,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined
    });

    return {
      token: shareLink.token,
      url: `/shared/sales-orders/${shareLink.token}`,
      expiresAt: shareLink.expiresAt
    };
  }

  async getSharedSalesOrder(token: string) {
    const shareLink = await this.sharingRepository.findByToken(token);

    if (
      !shareLink ||
      shareLink.entityType !== "SalesOrder" ||
      isExpired(shareLink.expiresAt)
    ) {
      throw new NotFoundException("Link de compartilhamento nao encontrado");
    }

    return this.salesOrdersService.findById(shareLink.entityId);
  }
}

function isExpired(expiresAt: Date | null) {
  return Boolean(expiresAt && expiresAt.getTime() <= Date.now());
}
