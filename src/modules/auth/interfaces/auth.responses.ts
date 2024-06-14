import { UserDocument } from "../../user/schemas";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthResponse {
  @IsString()
  @ApiProperty()
  accessToken: string;

  @IsString()
  @ApiProperty()
  refreshToken?: string;

  @IsString()
  @ApiProperty()
  user?: UserDocument;

  @IsString()
  @ApiProperty()
  role?: string;
}
