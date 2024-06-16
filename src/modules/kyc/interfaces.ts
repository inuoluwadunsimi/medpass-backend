import { KycEnums } from "./enums/kyc.enums";

export interface uploadKyc {
  hospitalId?: string;
  file: Express.Multer.File;
  kycType: KycEnums;
}
