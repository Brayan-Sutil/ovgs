import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AccessAction, AccessModule } from "../../common/access-control/access-control.types";
import { RequirePermission } from "../../common/access-control/require-permission.decorator";
import { AuditService } from "./audit.service";

@ApiTags("audit")
@Controller()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get("audit-events")
  @RequirePermission(AccessModule.Audit, AccessAction.Read)
  findAll() {
    return this.auditService.findAll();
  }

  @Get("sales-orders/:id/audit-events")
  @RequirePermission(AccessModule.Audit, AccessAction.Read)
  findSalesOrderEvents(@Param("id") id: string) {
    return this.auditService.findSalesOrderEvents(id);
  }
}
