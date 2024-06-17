import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class CreateAppointmentDto {
  @ApiProperty({ example: "2021-09-01T00:00:00.000Z" })
  @IsDate()
  date: Date;

  @ApiProperty({ example: ["running stomach", "headache"] })
  @IsArray()
  complaint: string[];

  @ApiProperty({ example: ["running stomach", "headache"] })
  @IsArray()
  doctorsReport: string[];
}

export class UpdateAppointmentDto extends CreateAppointmentDto {}
