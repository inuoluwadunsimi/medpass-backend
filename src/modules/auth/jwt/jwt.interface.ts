import { type Request } from "express";
import { UserRole } from "../../user/interfaces/user.enums";

// details needed to generate a token
export interface GenerateTokenParam {
  email: string;
  userId?: string;
  type: JwtType;
  deviceId?: string;
  department?: string;
  hospital?: string;
  expiresIn?: number;
  role?: UserRole;
}

export enum JwtType {
  DOCTOR = " doctor",
  HOD = "hod",
  USER = "USER",
  ADMIN = "ADMIN_USER",
  PASSWORD_RESET = "PASSWORD_RESET",
}

export interface IExpressRequest extends Request {
  userId?: string;
  email?: string;
  deviceId: string;
  role: UserRole;
}
