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
} from "@nestjs/common";
import * as ResponseManager from "../../helpers/response.helpers";
import { ApiTags } from "@nestjs/swagger";

@Controller("hospital/:hospitalId/department")
@ApiTags("department")
export class DepartmentController {}
