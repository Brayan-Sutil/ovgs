import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { RecordAuditEventInput } from "./audit.types";

@Injectable()
export class AuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: RecordAuditEventInput) {
    return this.prisma.auditEvent.create({
      data: {
        entityType: input.entityType,
        entityId: input.entityId,
        action: input.action,
        previousState: toNullableJson(input.previousState),
        nextState: toNullableJson(input.nextState)
      }
    });
  }

  findByEntity(entityType: string, entityId: string) {
    return this.prisma.auditEvent.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: "desc" }
    });
  }

  findAll() {
    return this.prisma.auditEvent.findMany({
      orderBy: { createdAt: "desc" }
    });
  }
}

function toNullableJson(value: RecordAuditEventInput["previousState"]) {
  if (value === undefined) {
    return undefined;
  }

  return value === null ? Prisma.JsonNull : value;
}
