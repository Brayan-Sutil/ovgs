import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class CreateItemDto {
  @ApiProperty({ example: "SKU-001" })
  @IsString()
  @MinLength(2)
  sku: string;

  @ApiProperty({ example: "Produto acabado" })
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
