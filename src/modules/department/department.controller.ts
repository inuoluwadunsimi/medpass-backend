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
import { Department, DepartmentSchema } from "./schema/department.schema";
import { CreateDepartment } from "./dtos/create.department.dto";
import { AppAuthGuard } from "../auth/guards/auth.guard";
import { DepartmentService } from "./department.service";
import { Request, Response } from "express";
import { Doctor } from "./schema/doctor.schema";
@UseGuards(AppAuthGuard)
@Controller("hospital/:hospitalId/department")
@ApiTags("department")
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Post()
  @ApiResponse({ status: 201, type: Department })
  public async createDepartment(
    @Body() body: CreateDepartment,
    @Param("hospitalId") hospitalId: string,
    @Res() res: any
  ): Promise<void> {
    try {
      const data = await this.departmentService.createDepartment(
        hospitalId,
        body
      );
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
        message: "Department fetched successfully",
        data,
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }

  @ApiResponse({ status: 200, type: [Doctor] })
  @Get("/doctor/:departmentId")
  public async getDepartmentDoctors(
    @Res() res: any,
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
    @Param() departmentId: string,
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
