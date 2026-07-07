import { Module } from "@nestjs/common";
import { SalesOrdersModule } from "../sales-orders/sales-orders.module";
import { SchedulingController } from "./scheduling.controller";

@Module({
  imports: [SalesOrdersModule],
  controllers: [SchedulingController]
})
export class SchedulingModule {}
