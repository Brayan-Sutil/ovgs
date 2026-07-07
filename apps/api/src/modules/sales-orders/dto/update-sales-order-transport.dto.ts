import { IsUUID } from "class-validator";

export class UpdateSalesOrderTransportDto {
  @IsUUID("4")
  transportTypeId: string;
}
