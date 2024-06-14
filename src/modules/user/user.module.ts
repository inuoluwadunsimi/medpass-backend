import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserAuth, UserAuthSchema, UserSchema } from "./schemas";
import { Otp, OtpSchema } from "./schemas/user.otp.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserAuth.name, schema: UserAuthSchema },
      { name: UserAuth.name, schema: UserAuthSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
  ],
})
export class UserModule {}
