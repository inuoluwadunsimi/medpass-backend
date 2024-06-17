import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
  Param,
  Put,
  Req,
} from "@nestjs/common";
import * as ResponseManager from "../../helpers/response.helpers";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppAuthGuard } from "../auth/guards/auth.guard";
import { NotificationService } from "./notification.service";
import { Response } from "express";
import { IExpressRequest } from "../auth/jwt/jwt.interface";

@Controller("notification")
@ApiTags("notification")
@UseGuards(AppAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiResponse({ status: 200, type: [Notification] })
  @ApiOperation({
    summary: "Get all notifications",
  })
  public async getNotifications(
    @Res() res: Response,
    @Req() req: IExpressRequest
  ): Promise<void> {
    const user = req.userId;
    try {
      const data = await this.notificationService.getNotifications(user);
      ResponseManager.success(res, { data });
    } catch (err: any) {
      ResponseManager.handleError(res, err);
    }
  }

  @Get("/:notificationId")
  @ApiResponse({ status: 200, type: [Notification] })
  @ApiOperation({
    summary: "Get all notifications",
  })
  public async getSingleNotification(
    @Res() res: Response,
    @Param("notificationId") notificationId: string
  ): Promise<void> {
    try {
      const data =
        await this.notificationService.getSingleNotificaton(notificationId);
      ResponseManager.success(res, { data });
    } catch (err: any) {
      ResponseManager.handleError(res, err);
    }
  }
}
