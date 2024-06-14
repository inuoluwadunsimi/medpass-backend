import { type Request } from "express";
import { User } from "../../user/schemas";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../../user/interfaces/user.enums";

// details needed to generate a token
export interface GenerateTokenParam {
  email: string;
  userId?: string;
  type: JwtType;
  deviceId: string;
  expiresIn?: number;
  role?: UserRole;
}

export enum JwtType {
  NEW_USER = "NEW_USER",
  USER = "USER",
  ADMIN = "ADMIN_USER",
  VERIFICATION = "VERIFICATION",
  PASSWORD_RESET = "PASSWORD_RESET",
}

export interface IExpressRequest extends Request {
  userId?: string;
  email?: string;
  deviceId: string;
  role: UserRole;
}
