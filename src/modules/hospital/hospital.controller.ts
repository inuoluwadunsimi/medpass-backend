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
  UseInterceptors,
} from "@nestjs/common";
import { memoryStorage } from "multer";
import * as ResponseManager from "../../helpers/response.helpers";
import { ApiConsumes, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HospitalService } from "./hospital.service";
import { Request, Response } from "express";
import { CreateHospitalDto } from "./dtos/create-hospital.dto";
import { AppAuthGuard } from "../auth/guards/auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../user/interfaces/user.enums";
import { Roles } from "../../decorators/roles.decorator";
import { Hospital } from "./schemas/hospital.schema";
import { IExpressRequest } from "../auth/jwt/jwt.interface";
import { KycEnums } from "../kyc/enums/kyc.enums";
import { FileInterceptor } from "@nestjs/platform-express";
import { KycService } from "../kyc/kyc.service";

@Controller("hospital")
@ApiTags("hospital")
@UseGuards(AppAuthGuard)
export class HospitalController {
  constructor(
    private readonly hospitalService: HospitalService,
    private readonly kycService: KycService
  ) {}

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

  @Post("/kyc/:hospitalId")
  @UseInterceptors(FileInterceptor("kycFile", { storage: memoryStorage() }))
  @ApiResponse({ status: 200, description: "kyc document uploaded" })
  @ApiConsumes("multipart/form-data")
  public async kycUpload(
    @Param() hospitalId: string,
    @Body() kycType: KycEnums,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      await this.kycService.UploadKycDocument({
        hospitalId,
        kycType,
        file,
      });
      ResponseManager.success(res, { message: "kyc document uploaded" });
    } catch (err) {
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
