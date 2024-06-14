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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserAuth.name, schema: UserAuthSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
    UserModule,
  ],
})
export class AuthModule {}
