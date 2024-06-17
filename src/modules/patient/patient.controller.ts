import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
  Param,
} from "@nestjs/common";
import * as ResponseManager from "../../helpers/response.helpers";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { PatientService } from "./patient.service";
import { AppAuthGuard } from "../auth/guards/auth.guard";
import { Patient } from "./schemas/patient.schema";

@Controller("patient")
@ApiTags("patient")
@UseGuards(AppAuthGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiResponse({ status: 201, description: "Patient created successfully" })
  @ApiResponse({ status: 201, type: Patient })
  public async createPatient(@Res() res, @Body() body): Promise<void> {
    try {
      const data = await this.patientService.createPatient(body);
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
