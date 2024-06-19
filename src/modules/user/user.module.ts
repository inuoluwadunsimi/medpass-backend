import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  User,
  UserAuth,
  UserAuthSchema,
  UserSchema,
  UserToken,
  UserTokenSchema,
} from "./schemas";
import { Otp, OtpSchema } from "./schemas";
import { UserController } from "./user.controller";
import { JwtHelper } from "../auth/jwt/jwt.helper";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { Hospital, HospitalSchema } from "../hospital/schemas/hospital.schema";
import { Doctor, DoctorSchema } from "../department/schema/doctor.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserAuth.name, schema: UserAuthSchema },
      { name: UserToken.name, schema: UserTokenSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: Hospital.name, schema: HospitalSchema },
      { name: Doctor.name, schema: DoctorSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [JwtHelper, UserService, JwtService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
