import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HospitalService } from "./hospital.service";
import { HospitalSchema, Hospital } from "./schemas/hospital.schema";
import { HospitalController } from "./hospital.controller";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AppAuthGuard } from "../auth/guards/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { KycService } from "../kyc/kyc.service";
import { KycModule } from "../kyc/kyc.module";
import { KYC, KYCSchema } from "../kyc/schemas/kyc.schema";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hospital.name, schema: HospitalSchema },
      { name: KYC.name, schema: KYCSchema },
    ]),
    KycModule,
  ],
  controllers: [HospitalController],
  providers: [
    HospitalService,
    RolesGuard,
    AppAuthGuard,
    JwtService,
    KycService,
    CloudinaryService,
  ],
  exports: [MongooseModule, HospitalService],
})
export class HospitalModule {}
