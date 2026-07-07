import { Module } from "@nestjs/common";
import { PrismaModule } from "./common/prisma/prisma.module";
import { AuditModule } from "./modules/audit/audit.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { ItemsModule } from "./modules/items/items.module";
import { SalesOrdersModule } from "./modules/sales-orders/sales-orders.module";
import { SchedulingModule } from "./modules/scheduling/scheduling.module";
import { TransportTypesModule } from "./modules/transport-types/transport-types.module";

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    CustomersModule,
    TransportTypesModule,
    ItemsModule,
    SalesOrdersModule,
    SchedulingModule
  ]
})
export class AppModule {}
