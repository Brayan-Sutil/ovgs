import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { SalesOrdersController } from "./sales-orders.controller";
import { SalesOrdersRepository } from "./sales-orders.repository";
import { SalesOrdersService } from "./sales-orders.service";

@Module({
  imports: [AuditModule],
  controllers: [SalesOrdersController],
  providers: [SalesOrdersRepository, SalesOrdersService],
  exports: [SalesOrdersService]
})
export class SalesOrdersModule {}
