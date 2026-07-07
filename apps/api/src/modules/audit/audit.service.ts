import { Injectable } from "@nestjs/common";
import { AuditRepository } from "./audit.repository";
import { RecordAuditEventInput } from "./audit.types";

@Injectable()
export class AuditService {
  constructor(private readonly auditRepository: AuditRepository) {}

  record(input: RecordAuditEventInput) {
    return this.auditRepository.create(input);
  }

  findAll() {
    return this.auditRepository.findAll();
  }

  findSalesOrderEvents(salesOrderId: string) {
    return this.auditRepository.findByEntity("SalesOrder", salesOrderId);
  }
}
