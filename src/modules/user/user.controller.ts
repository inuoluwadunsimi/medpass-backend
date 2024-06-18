import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AppAuthGuard } from "../auth/guards/auth.guard";
import * as ResponseManager from "../../helpers/response.helpers";
import { UserService } from "./user.service";
import { User } from "./schemas";
import { Response } from "express";
import { IExpressRequest } from "../auth/jwt/jwt.interface";
@Controller("user")
@ApiTags("user")
@UseGuards(AppAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/me")
  @ApiResponse({ status: 200, type: User })
  public async getUserProfile(
    @Res() res: Response,
    @Req() req: IExpressRequest
  ): Promise<void> {
    const user = req.userId;
    try {
      const data = await this.userService.getUserProfile(user);
      ResponseManager.success(res, { data });
      ``;
    } catch (err: any) {
      ResponseManager.handleError(res, err);
    }
  }
}
