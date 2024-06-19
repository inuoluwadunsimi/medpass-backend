import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class CreateAdmissionDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ example: ["golam", "folape"] })
  complaints: string[];
}
