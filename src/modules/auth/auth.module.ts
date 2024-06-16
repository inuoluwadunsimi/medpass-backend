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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserAuth.name, schema: UserAuthSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: Doctor.name, schema: DoctorSchema },
    ]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [UserService, EmailService, JwtHelper, JwtService, AuthService],
  exports: [UserService, MongooseModule, AuthService],
})
export class AuthModule {}
