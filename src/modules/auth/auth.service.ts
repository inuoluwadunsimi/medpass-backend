import { Injectable, NotFoundException } from "@nestjs/common";
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
import { SignupDto, VerifyOtp } from "./dtos/signup.dto";
import { UserRole } from "../user/interfaces/user.enums";
import { UserService } from "../user/user.service";
import { EmailService } from "../mail/mail.service";
import { JwtHelper } from "./jwt/jwt.helper";
import { JwtType } from "./jwt/jwt.interface";
import { AuthResponse } from "./interfaces/auth.responses";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserAuth.name) private userAuthModel: Model<UserAuthDocument>,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly jwtHelper: JwtHelper
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

  public async verifyOtp(
    body: VerifyOtp,
    deviceId: string
  ): Promise<AuthResponse> {
    const user = await this.userModel.findOne<UserDocument>({
      email: body.email,
    });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    const otp = await this.otpModel.findOne<OtpDocument>({
      email: body.email,
      otp: body.otp,
      deviceId,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    if (!otp) {
      throw new NotFoundException("invalid otp");
    }

    await this.userAuthModel.updateOne(
      { email: body.email },
      { isVerified: true }
    );

    await this.otpModel.deleteOne({ email: body.email, otp: body.otp });
    const response = await this.userService.saveUserToken({
      email: body.email,
      userId: user.id,
      type: user.role === UserRole.ADMIN ? JwtType.ADMIN : JwtType.USER,
      deviceId,
      role: user.role,
      user,
    });
    return response;
  }

  public async resendOtp(email: string, deviceId: string): Promise<void> {
    const user = await this.userModel.findOne<UserDocument>({ email });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    const otp = this.userService.generateOtp();
    await this.otpModel.create({
      email,
      otp,
      deviceId,
      otpType: OtpType.SIGN_UP,
    });
    await this.emailService.sendOtpMail(email, otp, user.firstName);
  }
}
