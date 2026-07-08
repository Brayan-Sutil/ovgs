import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AccessControlGuard } from "./common/access-control/access-control.guard";
import { PrismaModule } from "./common/prisma/prisma.module";
import { AuditModule } from "./modules/audit/audit.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { HealthModule } from "./modules/health/health.module";
import { ItemsModule } from "./modules/items/items.module";
import { SalesOrdersModule } from "./modules/sales-orders/sales-orders.module";
import { SchedulingModule } from "./modules/scheduling/scheduling.module";
import { SharingModule } from "./modules/sharing/sharing.module";
import { TransportTypesModule } from "./modules/transport-types/transport-types.module";

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    CustomersModule,
    TransportTypesModule,
    ItemsModule,
    SalesOrdersModule,
    SchedulingModule,
    SharingModule,
    HealthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessControlGuard
    }
  ]
})
export class AppModule {}
