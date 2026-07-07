import { IsBoolean, IsDateString, IsOptional, Matches } from "class-validator";

const timeExpression = /^([01]\d|2[0-3]):[0-5]\d$/;

export class UpdateSalesOrderScheduleDto {
  @IsDateString()
  deliveryDate: string;

  @Matches(timeExpression)
  deliveryWindowStart: string;

  @Matches(timeExpression)
  deliveryWindowEnd: string;

  @IsOptional()
  @IsBoolean()
  confirmed?: boolean;
}
