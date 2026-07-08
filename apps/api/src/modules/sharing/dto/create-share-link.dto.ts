import { IsDateString, IsOptional } from "class-validator";

export class CreateShareLinkDto {
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
