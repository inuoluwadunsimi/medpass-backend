import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { Request, Response } from "express";
import { CreateHospitalDto } from "./dtos/create-hospital.dto";
import { AppAuthGuard } from "../auth/guards/auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../user/interfaces/user.enums";
import { Roles } from "../../decorators/roles.decorator";
import { Hospital } from "./schemas/hospital.schema";
import { IExpressRequest } from "../auth/jwt/jwt.interface";

@Controller("hospital")
@ApiTags("hospital")
@UseGuards(AppAuthGuard)
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 201, type: Hospital })
  public async createHospital(
    @Req() req: IExpressRequest,
    @Res() res: Response,
    @Body() body: CreateHospitalDto
  ): Promise<void> {
    const user = req.userId;
    try {
      const data = await this.hospitalService.createHospital(body, user);
      ResponseManager.success(res, { data });
    } catch (err: any) {
      ResponseManager.handleError(res, err);
    }
  }

  @Get("/:hospitalId")
  @ApiResponse({ status: 200, type: Hospital })
  public async getHospitalProfile(
    @Param() hospitalId: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      const hospital =
        await this.hospitalService.getHospitalProfile(hospitalId);
      ResponseManager.success(res, { hospital });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }
}
