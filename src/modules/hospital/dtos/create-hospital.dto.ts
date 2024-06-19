import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
export class CreateHospitalDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: "hospital@feline.co" })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Lagos" })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Lagos" })
  website_url: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Ikeja" })
  address: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: "08012345678" })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(14)
  @ApiProperty({ example: "JEKFNRB2048302" })
  cac_number: string;
}
