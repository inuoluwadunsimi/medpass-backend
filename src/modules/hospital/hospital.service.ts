import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Hospital, HospitalDocument } from "./schemas/hospital.schema";
import { CreateHospitalDto } from "./dtos/create-hospital.dto";
import { CreateAppointmentDto } from "../patient/dtos/create.appointment.dto";
import { Doctor, DoctorDocument } from "../department/schema/doctor.schema";
import {
  Admission,
  AdmissionDocument,
  AdmissionStatus,
} from "./schemas/admission.schema";
import { CreateAdmissionDto } from "./dtos/create.admission.dto";

@Injectable()
export class HospitalService {
  constructor(
    @InjectModel(Hospital.name) private hospitalModel: Model<HospitalDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Admission.name)
    private admissionModel: Model<AdmissionDocument>
  ) {}

  public async createHospital(
    body: CreateHospitalDto,
    user: string
  ): Promise<HospitalDocument> {
    return await this.hospitalModel.create({
      created_by: user,
      ...body,
    });
  }

  public async getHospitalProfile(
    hospitalId: string
  ): Promise<HospitalDocument> {
    const hospital = await this.hospitalModel.findOne<HospitalDocument>({
      _id: hospitalId,
    });
    if (!hospital) {
      throw new NotFoundException("hospital not found");
    }

    return hospital;
  }

  public async admitPatient(
    body: CreateAdmissionDto,
    user: string,
    patientId: string
  ) {
    const doctor = await this.doctorModel.findOne<DoctorDocument>({ user });
    const department = doctor.department as string;
    const hospital = doctor.hospital as string;
    const admission = await this.admissionModel.create({
      patient: patientId,
      doctor: doctor.id,
      hospital: hospital,
      department,
      ...body,
    });
    return admission;
  }

  public async changeAdmissionStatus(body: {
    status: AdmissionStatus;
    admissionId: string;
  }) {
    const { status, admissionId } = body;
    const admission =
      await this.admissionModel.findOneAndUpdate<AdmissionDocument>(
        { _id: admissionId },
        { status },
        { new: true }
      );
    if (!admission) {
      throw new NotFoundException("Admission not found");
    }
    return admission;
  }

  public async getAllAdmittedPatients(
    departmentId: string,
    hospitalId: string,
    status: AdmissionStatus,
    from: Date,
    to: Date
  ): Promise<AdmissionDocument[]> {
    const filter: any = { hospital: hospitalId };
    if (departmentId) {
      filter.department = departmentId;
    }
    if (status) {
      filter.status = status;
    }

    if (from && to) {
      filter.date = {
        $gte: from,
        $lte: to,
      };
    }
    return await this.admissionModel
      .find(filter)
      .populate("patient")
      .populate("doctor")
      .populate("hospital")
      .populate("department");
  }
}
