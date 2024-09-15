import { ApiProperty } from "@nestjs/swagger";
import { IS_UUID, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateDepartment {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "surgery" })
  departmentName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: "dave@doctor.co" })
  departmentEmail: string;

  @IsEmail()
  @IsString()
  @ApiProperty({ example: "daju@kala.com" })
  hodEmail: string;

  @ApiProperty()
  @IsString()
  @ApiProperty({ example: "gegemu" })
  description: string;
}

export class inviteDoctorDto {
  @IsEmail()
  @IsString()
  @ApiProperty({ example: "daju@kala.com" })
  email: string;

  @IsString()
  @ApiProperty({ example: "382903820-293929-293" })
  departmentId: string;
}
