import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class DosageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "aspirin" })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "3 before you wake up" })
  dosage: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "mg" })
  measurement: string;
}

export class CreateAdmissionDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ example: ["golam", "folape"] })
  complaints: string[];

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ example: ["golam", "folape"] })
  symptoms: string[];

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ example: ["golam", "folape"] })
  tests: string[];

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ example: ["golam", "folape"] })
  diagnosis: string[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DosageDto)
  treatment: DosageDto;
}
