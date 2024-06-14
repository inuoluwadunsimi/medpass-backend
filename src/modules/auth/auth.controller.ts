import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import * as ResponseManager from "../../helpers/response.helpers";

import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { SignupDto, VerifyOtp } from "./dtos/signup.dto";
import { Request, Response } from "express";

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

  @Post("otp/verify")
  @ApiResponse({
    status: 201,
    description: "Registered Successfully",
    type: String,
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
        message: "Registered Successfully",
        data,
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }
}
