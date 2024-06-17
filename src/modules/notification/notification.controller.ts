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

@Controller("notification")
@ApiTags("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
}
