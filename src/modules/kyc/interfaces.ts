import { KycEnums } from "./enums/kyc.enums";

export interface uploadKyc {
  hospitalId?: string;
  files: Express.Multer.File[];
  kycType: KycEnums[];
}

export interface uploadDoctorKyc {
  user: string;
  file: Express.Multer.File;
}
