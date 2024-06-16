import { KycEnums } from "./enums/kyc.enums";

export interface uploadKyc {
  hospitalId?: string;
  files: Express.Multer.File[];
  kycType: KycEnums[];
}
