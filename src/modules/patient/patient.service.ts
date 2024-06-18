import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isEmpty } from "lodash";
import { Patient, PatientDocument } from "./schemas/patient.schema";
import { Model } from "mongoose";
import { CreatePatientDto } from "./dtos/create.patient.dto";
import { User, UserDocument } from "../user/schemas";
import { UserRole } from "../user/interfaces/user.enums";
import { CreateBioData } from "./dtos/create.biodata";
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from "./dtos/create.appointment.dto";
import { Doctor, DoctorDocument } from "../department/schema/doctor.schema";
import { Appointment, AppointmentDocument } from "./schemas/appointment.schema";

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>
  ) {}

  public async generatePatientId(): Promise<string> {
    const digits = Math.floor(10000000 + Math.random() * 90000000);

    const uniqueId = `PAT-${digits}`;
    const check = await this.patientModel.find({ patientId: uniqueId });

    if (isEmpty(check)) {
      return uniqueId;
    }
    return this.generatePatientId();
  }

  public async searchPatientById(
    patientId: string
  ): Promise<PatientDocument[]> {
    const results = await this.patientModel
      .find<PatientDocument>({
        $text: { $search: patientId },
      })
      .populate("user");
    return results;
  }

  public async createPatient(body: CreatePatientDto): Promise<PatientDocument> {
    const user = await this.userModel.create({
      ...body,
      role: UserRole.PATIENT,
    });

    const patientId = await this.generatePatientId();

    const patient = await this.patientModel.create({
      user: user.id,
      patientId,
    });

    return patient;
  }

  public async getPatientById(patientId: string): Promise<PatientDocument> {
    const patient = await this.patientModel.findOne<PatientDocument>({
      _id: patientId,
    });
    if (!patient) {
      throw new NotFoundException("Patient not found");
    }
    return patient;
  }

  public async fillPatientBiodata(
    patientId: string,
    body: CreateBioData
  ): Promise<PatientDocument> {
    const patient = await this.patientModel
      .findOneAndUpdate<PatientDocument>(
        { _id: patientId },
        { ...body },
        { new: true }
      )
      .populate("user");
    if (!patient) {
      throw new NotFoundException("Patient not found");
    }
    return patient;
  }

  public async createRecord(
    body: CreateAppointmentDto,
    patientId: string,
    user: string
  ): Promise<AppointmentDocument> {
    const doctor = await this.doctorModel.findOne<DoctorDocument>({
      user: user,
    });

    if (!doctor) {
      throw new NotFoundException("Doctor not found");
    }

    const record = await this.appointmentModel.create({
      doctor: doctor.id,
      hospital: doctor.hospital,
      department: doctor.department,
      patient: patientId,
      ...body,
    });
    return record;
  }

  public async updateRecord(
    recordId: string,
    body: UpdateAppointmentDto
  ): Promise<AppointmentDocument> {
    const record =
      await this.appointmentModel.findOneAndUpdate<AppointmentDocument>(
        { _id: recordId },
        { ...body },
        { new: true }
      );

    if (!record) {
      throw new NotFoundException("Record not found");
    }
    return record;
  }

  public async getRecord(recordId: string): Promise<AppointmentDocument> {
    const record = await this.appointmentModel.findOne<AppointmentDocument>({
      _id: recordId,
    });
    if (!record) {
      throw new NotFoundException("Record not found");
    }
    return record;
  }

  public async getAllRecords(body: {
    patientId: string;
    hospitalId?: string;
    from?: Date;
    to?: Date;
  }): Promise<AppointmentDocument[]> {
    const { patientId, hospitalId, from, to } = body;
    const filter: any = { patient: patientId };
    if (hospitalId) {
      filter.hospital = hospitalId;
    }

    if (from && to) {
      filter.date = {
        $gte: from,
        $lte: to,
      };
    }
    const records =
      await this.appointmentModel.find<AppointmentDocument>(filter);
    return records;
  }

  public async forwardToDepartment(
    recordId: string,
    departmentId: string
  ): Promise<void> {}
}
