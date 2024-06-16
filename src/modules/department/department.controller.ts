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

@Controller("hospital/:hospitalId/department")
@ApiTags("department")
export class DepartmentController {
  constructor() {}

  @Post()
  @ApiResponse({ status: 201, type: Department })
  public async createDepartment(
    @Body() body: CreateDepartment,
    @Param("hospitalId") hospitalId: string,
    @Req() req: any,
    @Res() res: any
  ): Promise<void> {
    try {
      ResponseManager.success(res, {
        data: body,
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }

  @Get()
  public async getDepartments(@Req() req: any, @Res() res: any): Promise<void> {
    try {
      ResponseManager.success(res, {
        message: "Department fetched successfully",
        data: [],
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }

  @Get(":departmentId")
  public async getDepartment(@Req() req: any, @Res() res: any): Promise<void> {
    try {
      ResponseManager.success(res, {
        message: "Department fetched successfully",
        data: {},
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }

  @Patch(":departmentId")
  public async updateDepartment(
    @Body() body: any,
    @Req() req: any,
    @Res() res: any
  ): Promise<void> {
    try {
      ResponseManager.success(res, {
        message: "Department updated successfully",
        data: body,
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }

  @Delete(":departmentId")
  public async deleteDepartment(
    @Req() req: any,
    @Res() res: any
  ): Promise<void> {
    try {
      ResponseManager.success(res, {
        message: "Department deleted successfully",
        data: {},
      });
    } catch (err) {
      ResponseManager.handleError(res, err);
    }
  }
}
