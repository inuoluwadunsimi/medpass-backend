import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, Min } from "class-validator";

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Joshua" })
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty({ example: "fred@gmail.com" })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: "" })
  password: string;
}

export class VerifyOtp {
  @ApiProperty({ example: "danielolaoladeinde" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: "123456" })
  @IsNotEmpty()
  @IsString()
  @Min(6)
  otp: string;
}
