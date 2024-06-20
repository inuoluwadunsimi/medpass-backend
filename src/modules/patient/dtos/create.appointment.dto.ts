import { ApiProperty } from "@nestjs/swagger";
import {
  IS_DATE_STRING,
  IsArray,
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class TreatmentDto {
  @ApiProperty({ example: "aspirin" })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: "aspirin" })
  @IsString()
  @IsOptional()
  description: string;
}

export class PrescriptionDto {
  @ApiProperty({ example: "aspirin" })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: "95mg" })
  @IsString()
  @IsOptional()
  mg: string;

  @ApiProperty({ example: "aspirin f" })
  @IsString()
  @IsOptional()
  measurement: string;

  @ApiProperty({ example: "29 times daily" })
  @IsString()
  @IsOptional()
  frequency: string;
}

export class CreateAppointmentDto {
  @ApiProperty({ example: "2021-09-01T00:00:00.000Z" })
  @IsDateString()
  date: String;

  @ApiProperty({ example: ["running stomach", "headache"] })
  @IsArray()
  complaint: string[];

  @ApiProperty({ example: ["running stomach", "headache"] })
  @IsArray()
  doctorsReport: string[];
}

export class UpdateAppointmentDto extends CreateAppointmentDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => TreatmentDto)
  treatment: TreatmentDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => PrescriptionDto)
  prescription: PrescriptionDto;
}
