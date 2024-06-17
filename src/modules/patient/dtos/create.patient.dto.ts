import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class CreatePatientDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ example: "patient@kola.com" })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "feka" })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "feka" })
  lastName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: "08012345678" })
  phoneNumber: string;
}
