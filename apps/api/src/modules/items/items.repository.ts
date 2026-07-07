import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateItemDto } from "./dto/create-item.dto";

@Injectable()
export class ItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateItemDto) {
    return this.prisma.item.create({ data: dto });
  }

  findAll() {
    return this.prisma.item.findMany({
      orderBy: { sku: "asc" }
    });
  }
}
