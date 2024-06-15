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
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { HospitalService } from "./hospital.service";

@Controller("hospital")
@ApiTags("hospital")
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post()
  @ApiResponse({})
  public async createHospital(): Promise<void> {}
}
