import { Module } from "@nestjs/common";
import { SalesOrdersModule } from "../sales-orders/sales-orders.module";
import { SharingController } from "./sharing.controller";
import { SharingRepository } from "./sharing.repository";
import { SharingService } from "./sharing.service";

@Module({
  imports: [SalesOrdersModule],
  controllers: [SharingController],
  providers: [SharingRepository, SharingService]
})
export class SharingModule {}
