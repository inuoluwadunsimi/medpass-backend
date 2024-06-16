import { Module } from "@nestjs/common";
import { KYC, KYCSchema } from "./schemas/kyc.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { KYCFile, KYCFileSchema } from "./schemas/kyc.file.schema";
import { Hospital, HospitalSchema } from "../hospital/schemas/hospital.schema";
import { KycService } from "./kyc.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KYC.name, schema: KYCSchema },
      { name: KYCFile.name, schema: KYCFileSchema },
      { name: Hospital.name, schema: HospitalSchema },
    ]),
  ],
  exports: [KycService],
  providers: [KycService, CloudinaryService],
})
export class KycModule {}
