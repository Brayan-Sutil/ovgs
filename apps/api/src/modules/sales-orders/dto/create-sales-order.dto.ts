import { Type } from "class-transformer";
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested
} from "class-validator";

export class CreateSalesOrderItemDto {
  @IsUUID("4")
  itemId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateSalesOrderDto {
  @IsUUID("4")
  customerId: string;

  @IsUUID("4")
  transportTypeId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique((item: CreateSalesOrderItemDto) => item.itemId)
  @ValidateNested({ each: true })
  @Type(() => CreateSalesOrderItemDto)
  items: CreateSalesOrderItemDto[];
}
