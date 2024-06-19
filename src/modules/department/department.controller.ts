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
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Department, DepartmentSchema } from "./schema/department.schema";
import {
  CreateDepartment,
  inviteDoctorDto,
} from "./dtos/create.department.dto";
import { AppAuthGuard } from "../auth/guards/auth.guard";
import { DepartmentService } from "./department.service";
import { Request, Response } from "express";
import { Doctor } from "./schema/doctor.schema";
import { IExpressRequest } from "../auth/jwt/jwt.interface";
@UseGuards(AppAuthGuard)
@Controller("hospital/:hospitalId/department")
@ApiTags("department")
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Post()
  @ApiResponse({ status: 201, type: Department })
  public async createDepartment(
    @Body() body: CreateDepartment,
    @Req() req: IExpressRequest,
    @Res() res: any
  ): Promise<void> {
    const user = req.userId;
    try {
      const data = await this.departmentService.createDepartment(user, body);
      ResponseManager.success(res, {
        data,
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }

  @ApiResponse({ status: 200, type: [Department] })
  @Get()
  public async getDepartments(
    @Res() res: any,
    @Param("hospitalId") hospitalId: string
  ): Promise<void> {
    try {
      const data = await this.departmentService.getDepartments(hospitalId);
      ResponseManager.success(res, {
        data,
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }

  @ApiOperation({ summary: "invite doctor to department" })
  @ApiResponse({ status: 200, description: "invite email sent" })
  @Post("/doctor")
  public async inviteDoctor(
    @Res() res: Response,
    @Body() body: inviteDoctorDto
  ): Promise<void> {
    try {
      await this.departmentService.inviteDoctor(body);
      ResponseManager.success(res, {
        message: "invite email sent",
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }

  @ApiResponse({ status: 200, type: [Doctor] })
  @Get("/doctor/:departmentId")
  public async getDepartmentDoctors(
    @Res() res: any,
    @Param("hospitalId") hospitalId: string,

    @Param("departmentId") departmentId: string
  ): Promise<void> {
    try {
      const data =
        await this.departmentService.getDepartmentDoctors(departmentId);
      ResponseManager.success(res, {
        data,
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }

  @ApiResponse({ status: 200, type: Department })
  @Get(":departmentId")
  public async getDepartment(
    @Param("hospitalId") hospitalId: string,
    @Param("departmentId") departmentId: string,
    @Res() res: any
  ): Promise<void> {
    try {
      const data = await this.departmentService.getDepartment(departmentId);
      ResponseManager.success(res, data);
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }
}
