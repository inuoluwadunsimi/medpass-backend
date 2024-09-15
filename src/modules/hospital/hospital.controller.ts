import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { memoryStorage } from "multer";
import * as ResponseManager from "../../helpers/response.helpers";
import {
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
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
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { KycService } from "../kyc/kyc.service";
import { CreateAdmissionDto } from "./dtos/create.admission.dto";
import { Admission, AdmissionStatus } from "./schemas/admission.schema";

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

  @Put("/admission/status")
  @ApiResponse({ status: 200, type: Admission })
  public async changeAdmissionStatus(
    @Res() res: Response,
    @Body() body: { status: AdmissionStatus; admissionId: string }
  ): Promise<void> {
    try {
      const data = await this.hospitalService.changeAdmissionStatus(body);
      ResponseManager.success(res, { data });
    } catch (err: any) {
      ResponseManager.handleError(res, err);
    }
  }

  @Post("/kyc/:hospitalId")
  @UseInterceptors(FilesInterceptor("kycFile", 3, { storage: memoryStorage() }))
  @ApiResponse({ status: 200, description: "kyc document uploaded" })
  @ApiConsumes("multipart/form-data")
  public async kycUpload(
    @Param("hospitalId") hospitalId: string,
    @Body() kycType: KycEnums[],
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    {
      if (files.length !== 3 || kycType.length !== 3) {
        throw new HttpException(
          "Three files and names are required",
          HttpStatus.BAD_REQUEST
        );
      }
      try {
        await this.kycService.UploadHospitalKYCDocument({
          hospitalId,
          kycType,
          files,
        });
        ResponseManager.success(res, { message: "kyc document uploaded" });
      } catch (err) {
        ResponseManager.handleError(res, err);
      }
    }
  }

  @ApiQuery({ name: "status", enum: AdmissionStatus, required: false })
  @ApiQuery({ name: "departmentId", type: String, required: false })
  @ApiQuery({ name: "from", type: Date, required: false })
  @ApiQuery({ name: "to", type: Date, required: false })
  @ApiOperation({ summary: "get all admitted patients" })
  @Get("/admitted-patient/:hospitalId")
  public async getAllAdmittedPatients(
    @Param("hospitalId") hospitalId: string,
    @Res() res: Response,
    @Query()
    query: {
      status: AdmissionStatus;
      departmentId: string;
      from: Date;
      to: Date;
    }
  ): Promise<void> {
    try {
      const data = await this.hospitalService.getAllAdmittedPatients(
        query.departmentId,
        hospitalId,
        query.status,
        query.from,
        query.to
      );
      ResponseManager.success(res, { data });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }

  @ApiOperation({ summary: "admit patient" })
  @Post("/admit/:patientId")
  public async admitPatient(
    @Req() req: IExpressRequest,
    @Param("patientId") patientId: string,
    @Res() res: Response,
    @Body() body: CreateAdmissionDto
  ): Promise<void> {
    try {
      const user = req.userId;
      const data = await this.hospitalService.admitPatient(
        body,
        user,
        patientId
      );
      ResponseManager.success(res, data);
    } catch (e) {
      ResponseManager.handleError(res, e);
    }
  }

  @Get("/:hospitalId")
  @ApiResponse({ status: 200, type: Hospital })
  public async getHospitalProfile(
    @Param("hospitalId") hospitalId: string,
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
