import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class CreateBioData {
  @ApiProperty({ example: "AA" })
  @IsString()
  genotype: string;

  @ApiProperty({ example: "AA" })
  @IsString()
  bloodGroup: string;

  @ApiProperty({ example: "AA" })
  @IsString()
  height: string;

  @ApiProperty({ example: "AA" })
  @IsString()
  weight: string;

  @ApiProperty({ example: "AA" })
  @IsArray()
  allergies: string[];
}
