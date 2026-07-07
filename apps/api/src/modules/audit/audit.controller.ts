import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuditService } from "./audit.service";

@ApiTags("audit")
@Controller()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get("audit-events")
  findAll() {
    return this.auditService.findAll();
  }

  @Get("sales-orders/:id/audit-events")
  findSalesOrderEvents(@Param("id") id: string) {
    return this.auditService.findSalesOrderEvents(id);
  }
}
