import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  UploadedFiles,
} from "@nestjs/common";
import * as ResponseManager from "../../helpers/response.helpers";
import { AuthResponse } from "./interfaces/auth.responses";

import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import {
  doctorSignupDto,
  resendOtp,
  SignupDto,
  VerifyOtp,
} from "./dtos/signup.dto";
import { Request, Response } from "express";
import { LoginDto } from "./dtos/login.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { IExpressRequest } from "./jwt/jwt.interface";
import { KycService } from "../kyc/kyc.service";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
    private kycService: KycService
  ) {}

  @Post("admin/register")
  @ApiResponse({
    status: 201,
    description: "Otp sent successfully",
    type: String,
  })
  @ApiOperation({ summary: " request admin otp" })
  public async ownerRegister(
    @Body() body: SignupDto,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const deviceId: string = req.get("User-Agent");
    try {
      await this.authService.ownerRegister(body, deviceId);
      ResponseManager.success(res, {
        message: "otp sent",
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }

  @ApiOperation({
    summary: "registers doctors and department heads",
  })
  @Post("signup")
  @ApiResponse({
    status: 201,
    description: "Registered Successfully",
    type: AuthResponse,
  })
  public async doctorRegister(
    @Body() body: doctorSignupDto,
    @Req() req: Request,
    @Res() res: Response,
    @Query("token") token: string
  ): Promise<void> {
    const deviceId = req.get("User-Agent");
    try {
      const data = await this.authService.doctorRegister({
        body,
        token,
        deviceId,
      });
      res.cookie("x-auth-token", data.accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 5184000,
      });
      ResponseManager.success(res, {
        message: "Registered Successfully",
        data,
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }

  @Post("/user/kyc")
  @ApiOperation({
    summary: "kyc upload for doctor",
  })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 201,
    description: "KYC verified",
    type: AuthResponse,
  })
  @UseInterceptors(FileInterceptor("kycFile", { storage: memoryStorage() }))
  public async uploadDoctorKyc(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Req() req: IExpressRequest
  ) {
    const user = req.userId;
    try {
      await this.kycService.uploadDoctorKycDocument({ user, file });

      ResponseManager.success(res, {
        message: "KYC verified",
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }

  @Post("otp/verify")
  @ApiOperation({ summary: " verify otp" })
  @ApiResponse({
    status: 201,
    type: AuthResponse,
  })
  public async verifyOtp(
    @Body() body: VerifyOtp,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const deviceId = req.get("User-Agent");
    try {
      const data = await this.authService.verifyOtp(body, deviceId);
      res.cookie("x-auth-token", data.accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 5184000,
      });
      ResponseManager.success(res, {
        data,
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }

  @Post("/otp/resend")
  @ApiResponse({ status: 200, description: "OTP sent successfully" })
  public async resendOtp(
    @Body() body: resendOtp,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const deviceId = req.get("User-Agent");
    try {
      await this.authService.resendOtp(body.email, deviceId);
      ResponseManager.success(res, {
        message: "OTP sent successfully",
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }

  @Post("login")
  @ApiResponse({ status: 200, type: AuthResponse })
  public async login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const deviceId = req.get("User-Agent");
    try {
      const data = await this.authService.login(body, deviceId);
      ResponseManager.success(res, {
        data,
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }
}
