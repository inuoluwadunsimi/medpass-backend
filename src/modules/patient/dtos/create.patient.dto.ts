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
  fullName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: "08012345678" })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "ogun" })
  state: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "feka" })
  homeAddress: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "male" })
  gender: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "single" })
  maritalStatus: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "single" })
  genotype: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "single" })
  bloodGroup: string;
}
