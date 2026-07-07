import { SalesOrderStatus } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateSalesOrderStatusDto {
  @IsEnum(SalesOrderStatus)
  status: SalesOrderStatus;
}
