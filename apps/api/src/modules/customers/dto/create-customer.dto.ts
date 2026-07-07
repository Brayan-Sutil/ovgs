import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MinLength
} from "class-validator";

export class CreateCustomerDto {
  @ApiProperty({ example: "Acme Distribuidora" })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: "12345678000199" })
  @IsString()
  @MinLength(5)
  document: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID("4", { each: true })
  authorizedTransportTypeIds?: string[];
}
