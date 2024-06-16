import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  User,
  UserAuthDocument,
  UserDocument,
  UserAuth,
  UserAuthSchema,
  UserSchema,
  Otp,
  OtpSchema,
} from "../user/schemas";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { UserService } from "../user/user.service";
import { EmailService } from "../mail/mail.service";
import { JwtHelper } from "./jwt/jwt.helper";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { Doctor, DoctorSchema } from "../department/schema/doctor.schema";
import { KycService } from "../kyc/kyc.service";
import { KYC, KYCSchema } from "../kyc/schemas/kyc.schema";
import { Hospital, HospitalSchema } from "../hospital/schemas/hospital.schema";
import { KycModule } from "../kyc/kyc.module";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserAuth.name, schema: UserAuthSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: KYC.name, schema: KYCSchema },
      { name: Hospital.name, schema: HospitalSchema },
    ]),
    UserModule,
    KycModule,
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    EmailService,
    JwtHelper,
    JwtService,
    AuthService,
    KycService,
    CloudinaryService,
  ],
  exports: [UserService, MongooseModule, AuthService],
})
export class AuthModule {}
