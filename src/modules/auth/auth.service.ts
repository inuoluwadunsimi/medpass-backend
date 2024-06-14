import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";
import {
  Otp,
  OtpDocument,
  OtpType,
  User,
  UserAuth,
  UserAuthDocument,
  UserDocument,
} from "../user/schemas";
import { SignupDto } from "./dtos/signup.dto";
import { UserRole } from "../user/interfaces/user.enums";
import { UserService } from "../user/user.service";
import { EmailService } from "../mail/mail.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserAuth.name) private userAuthModel: Model<UserAuthDocument>,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) {}

  public async ownerRegister(
    body: SignupDto,
    deviceId: string
  ): Promise<string> {
    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await this.userModel.create({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      role: UserRole.ADMIN,
    });

    await this.userAuthModel.create({
      email: body.email,
      password: passwordHash,
      user: user.id,
      recognisedDevice: [deviceId],
    });

    const otp = this.userService.generateOtp();

    await this.otpModel.create({
      email: body.email,
      otp,
      deviceId,
      otpType: OtpType.SIGN_UP,
    });

    await this.emailService.sendOtpMail(body.email, otp, body.firstName);

    return otp;
  }
}
