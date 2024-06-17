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
import { ApiTags } from "@nestjs/swagger";

@Controller("patient")
@ApiTags("patient")
export class PatientController {}
