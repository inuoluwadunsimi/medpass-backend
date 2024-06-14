import { UserDocument } from "../../user/schemas";

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user?: UserDocument;
  role?: string;
}
