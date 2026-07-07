import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateTransportTypeDto } from "./dto/create-transport-type.dto";
import { UpdateTransportTypeDto } from "./dto/update-transport-type.dto";

@Injectable()
export class TransportTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTransportTypeDto) {
    return this.prisma.transportType.create({ data: dto });
  }

  findAll() {
    return this.prisma.transportType.findMany({
      orderBy: { name: "asc" }
    });
  }

  update(id: string, dto: UpdateTransportTypeDto) {
    return this.prisma.transportType.update({
      where: { id },
      data: dto
    });
  }
}
