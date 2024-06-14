import { GenerateTokenParam } from "../../auth/jwt/jwt.interface";
import { UserDocument } from "../schemas";

export interface SaveToken extends GenerateTokenParam {
  user: UserDocument;
}
