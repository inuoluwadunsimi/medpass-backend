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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserAuth.name, schema: UserAuthSchema },
      { name: UserToken.name, schema: UserTokenSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [JwtHelper, UserService, JwtService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
