import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

const customerInclude = {
  authorizedTransportTypes: {
    include: {
      transportType: true
    }
  }
} satisfies Prisma.CustomerInclude;

@Injectable()
export class CustomersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        name: dto.name,
        document: dto.document,
        email: dto.email,
        authorizedTransportTypes: {
          create: dto.authorizedTransportTypeIds?.map((transportTypeId) => ({
            transportTypeId
          }))
        }
      },
      include: customerInclude
    });
  }

  findAll() {
    return this.prisma.customer.findMany({
      include: customerInclude,
      orderBy: { name: "asc" }
    });
  }

  findById(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: customerInclude
    });
  }

  update(id: string, dto: UpdateCustomerDto) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.authorizedTransportTypeIds) {
        await tx.customerTransportType.deleteMany({
          where: { customerId: id }
        });

        if (dto.authorizedTransportTypeIds.length > 0) {
          await tx.customerTransportType.createMany({
            data: dto.authorizedTransportTypeIds.map((transportTypeId) => ({
              customerId: id,
              transportTypeId
            }))
          });
        }
      }

      return tx.customer.update({
        where: { id },
        data: {
          name: dto.name,
          document: dto.document,
          email: dto.email
        },
        include: customerInclude
      });
    });
  }
}
