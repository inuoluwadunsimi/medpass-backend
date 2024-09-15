import { forwardRef, Module } from "@nestjs/common";
import { KYC, KYCSchema } from "./schemas/kyc.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { KYCFile, KYCFileSchema } from "./schemas/kyc.file.schema";
import { Hospital, HospitalSchema } from "../hospital/schemas/hospital.schema";
import { KycService } from "./kyc.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { Doctor, DoctorSchema } from "../department/schema/doctor.schema";
import { HospitalModule } from "../hospital/hospital.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KYC.name, schema: KYCSchema },
      { name: KYCFile.name, schema: KYCFileSchema },
      { name: Hospital.name, schema: HospitalSchema },
      { name: Doctor.name, schema: DoctorSchema },
    ]),
  ],

  exports: [KycService],
  providers: [KycService, CloudinaryService],
})
export class KycModule {}
