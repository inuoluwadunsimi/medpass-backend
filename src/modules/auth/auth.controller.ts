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

import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
@Controller("auth")
@ApiTags("auth")
export class AuthController {}
