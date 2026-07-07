import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class CreateTransportTypeDto {
  @ApiProperty({ example: "Caminhao" })
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
