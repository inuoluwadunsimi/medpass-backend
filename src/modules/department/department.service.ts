import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Department, DepartmentDocument } from "./schema/department.schema";
import {
  Hospital,
  HospitalDocument,
} from "../hospital/schemas/hospital.schema";
import { Doctor, DoctorDocument } from "./schema/doctor.schema";
import {
  CreateDepartment,
  inviteDoctorDto,
} from "./dtos/create.department.dto";
import { JwtHelper } from "../auth/jwt/jwt.helper";
import { JwtType } from "../auth/jwt/jwt.interface";
import { EmailService } from "../mail/mail.service";

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
    @InjectModel(Hospital.name) private hospitalModel: Model<HospitalDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    private jwtHelper: JwtHelper,
    private readonly emailService: EmailService
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

    const token = this.jwtHelper.generateToken({
      email: body.hodEmail,
      type: JwtType.HOD,
      hospital: hospitalId,
      department: department.id,
    });

    await this.emailService.sendInviteEmail(
      body.hodEmail,
      hospital.name,
      token.accessToken
    );

    return department;
  }

  public async getDepartments(
    hospitalId: string
  ): Promise<DepartmentDocument[]> {
    return await this.departmentModel.find({ hospital: hospitalId });
  }

  public async getDepartmentDoctors(
    departmentId: string
  ): Promise<DoctorDocument[]> {
    return await this.doctorModel.find({ department: departmentId });
  }

  public async getDepartment(departmentId: string) {
    const department = await this.departmentModel.findOne<DepartmentDocument>({
      _id: departmentId,
    });
    if (!department) {
      throw new NotFoundException("Department not found");
    }
    return department;
  }

  public async inviteDoctor(body: inviteDoctorDto) {
    const { email, departmentId } = body;
    const department = await this.departmentModel
      .findById<DepartmentDocument>(departmentId)
      .populate("hospital");
    const hospital = department.hospital as HospitalDocument;

    const token = this.jwtHelper.generateToken({
      email: email,
      type: JwtType.HOD,
      hospital: hospital.id,
      department: department.id,
    });

    await this.emailService.sendInviteEmail(
      email,
      hospital.name,
      token.accessToken
    );
  }
}
