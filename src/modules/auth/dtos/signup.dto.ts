import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Joshua" })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Ola" })
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty({ example: "fred@gmail.com" })
  email: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: "" })
  password: string;
}
