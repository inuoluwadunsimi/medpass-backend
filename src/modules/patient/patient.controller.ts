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
import { PatientService } from "./patient.service";
import { AppAuthGuard } from "../auth/guards/auth.guard";
import { Patient } from "./schemas/patient.schema";
import { Response } from "express";
import { CreateBioData } from "./dtos/create.biodata";
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from "./dtos/create.appointment.dto";
import { IExpressRequest } from "../auth/jwt/jwt.interface";
import { Appointment } from "./schemas/appointment.schema";
import { RecordQuery } from "./interfaces";
import { CreatePatientDto } from "./dtos/create.patient.dto";

@Controller("patient")
@ApiTags("patient")
@UseGuards(AppAuthGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiResponse({ status: 201, description: "Patient created successfully" })
  @ApiResponse({ status: 201, type: Patient })
  public async createPatient(
    @Res() res,
    @Body() body: CreatePatientDto
  ): Promise<void> {
    try {
      const data = await this.patientService.createPatient(body);
      ResponseManager.success(res, { data });
    } catch (err: any) {
      ResponseManager.handleError(res, err);
    }
  }

  @Get("/record/:patientId")
  @ApiResponse({ status: 200, type: [Appointment] })
  @ApiOperation({
    summary:
      " to get patient records for just that hospital, pass the hospitalId in the query",
  })
  public async getAllRecords(
    @Res() res: Response,
    @Query() query: RecordQuery,
    @Param() patientId: string
  ): Promise<void> {
    try {
      const data = await this.patientService.getAllRecords({
        patientId,
        ...query,
      });
      ResponseManager.success(res, { data });
    } catch (err: any) {
      ResponseManager.handleError(res, err);
    }
  }

  @Post("/record/:patientId")
  @ApiResponse({ status: 200, type: Appointment })
  public async createRecord(
    @Res() res,
    @Req() req: IExpressRequest,
    @Body() body: CreateAppointmentDto,
    @Param() patientId: string
  ): Promise<void> {
    const user = req.userId;
    try {
      const data = await this.patientService.createRecord(
        body,
        patientId,
        user
      );
      ResponseManager.success(res, { data });
    } catch (err: any) {
      ResponseManager.handleError(res, err);
    }
  }

  @Put("/record/:recordId")
  @ApiResponse({ status: 200, type: Appointment })
  public async updateRecord(
    @Res() res,
    @Body() body: UpdateAppointmentDto,
    @Param() recordId: string
  ): Promise<void> {
    try {
      const data = await this.patientService.updateRecord(recordId, body);
      ResponseManager.success(res, { data });
    } catch (err: any) {
      ResponseManager.handleError(res, err);
    }
  }

  @Get("/record/:recordId")
  @ApiResponse({ status: 200, type: Appointment })
  public async getRecord(@Res() res, @Param() recordId: string): Promise<void> {
    try {
      const data = await this.patientService.getRecord(recordId);
      ResponseManager.success(res, { data });
    } catch (err: any) {
      ResponseManager.handleError(res, err);
    }
  }

  @Get("/search")
  @ApiResponse({ status: 200, type: [Patient] })
  public async searchPatientById(
    @Res() res,
    @Query() patientId: string
  ): Promise<void> {
    try {
      const data = await this.patientService.searchPatientById(patientId);
      ResponseManager.success(res, { data });
    } catch (err: any) {
      ResponseManager.handleError(res, err);
    }
  }

  @Put("biodata/:patientId")
  @ApiResponse({ status: 200, type: Patient })
  public async fillPatientBiodata(
    @Res() res: Response,
    @Param() patientId: string,
    @Body() body: CreateBioData
  ): Promise<void> {
    try {
      const data = await this.patientService.fillPatientBiodata(
        patientId,
        body
      );
      ResponseManager.success(res, { data });
    } catch (err: any) {
      ResponseManager.handleError(res, err);
    }
  }

  @Get(":patientId")
  @ApiResponse({ status: 200, type: Patient })
  public async getPatientById(
    @Res() res,
    @Param() patientId: string
  ): Promise<void> {
    try {
      const data = await this.patientService.getPatientById(patientId);
      ResponseManager.success(res, { data });
    } catch (err: any) {
      ResponseManager.handleError(res, err);
    }
  }
}
