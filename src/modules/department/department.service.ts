import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Department, DepartmentDocument } from "./schema/department.schema";
import {
  Hospital,
  HospitalDocument,
} from "../hospital/schemas/hospital.schema";
import { Doctor, DoctorDocument } from "./schema/doctor.schema";
import { CreateDepartment } from "./dtos/create.department.dto";
import { JwtHelper } from "../auth/jwt/jwt.helper";

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
    @InjectModel(Hospital.name) private hospitalModel: Model<HospitalDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    private jwtHelper: JwtHelper
  ) {}

  public async createDepartment(hospitalId: string, body: CreateDepartment) {
    const hospital =
      await this.hospitalModel.findById<HospitalDocument>(hospitalId);
    if (!hospital) {
      throw new NotFoundException("Hospital not found");
    }

    const department = await this.departmentModel.create({
      hospital: hospitalId,
      departmentName: body.departmentName,
      departmentEmail: body.departmentEmail,
      description: body.description,
    });

    return department;
  }
}
