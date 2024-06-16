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
  UseGuards,
} from "@nestjs/common";
import * as ResponseManager from "../../helpers/response.helpers";
import { AuthResponse } from "./interfaces/auth.responses";

import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { SignupDto, VerifyOtp } from "./dtos/signup.dto";
import { Request, Response } from "express";
import { LoginDto } from "./dtos/login.dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService
  ) {}

  @Post("admin/register")
  @ApiResponse({
    status: 201,
    description: "Registered Successfully",
    type: String,
  })
  public async ownerRegister(
    @Body() body: SignupDto,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const deviceId = req.get("User-Agent");
    try {
      const data = await this.authService.ownerRegister(body, deviceId);
      ResponseManager.success(res, {
        message: "Registered Successfully",
        data,
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
    @Body() body: SignupDto,
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
      ResponseManager.success(res, {
        message: "Registered Successfully",
        data,
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }

  @Post("otp/verify")
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
    @Body() email: string,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const deviceId = req.get("User-Agent");
    try {
      await this.authService.resendOtp(email, deviceId);
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
