import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
import {
  Notification,
  NotificationDocument,
} from "../notification/schema/notification.schema";
import { NotificationService } from "../notification/notification.service";
import { AiService } from "./ai.search.service";

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly notificationService: NotificationService,
    private readonly aiService: AiService
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

  public async generateRecord(): Promise<string> {
    const digits = Math.floor(10000000 + Math.random() * 90000000);

    const uniqueId = `REC-${digits}`;
    const check = await this.appointmentModel.find({ record_id: uniqueId });

    if (isEmpty(check)) {
      return uniqueId;
    }
    return this.generatePatientId();
  }

  public async searchPatientById(
    patientId: string
  ): Promise<PatientDocument[]> {
    console.log(patientId);
    const results = await this.patientModel
      .find<PatientDocument>({
        $text: { $search: patientId },
      })
      .populate("user");
    return results;
  }

  public async createPatient(body: CreatePatientDto): Promise<PatientDocument> {
    console.log(body.email);
    const userDets = await this.userModel.findOne({ email: body.email });
    console.log(userDets);
    if (userDets) {
      throw new BadRequestException("account already created");
    }
    const user = await this.userModel.create({
      email: body.email,
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
      role: UserRole.PATIENT,
    });

    const patientId = await this.generatePatientId();

    const patient = await this.patientModel.create({
      user: user.id,
      patientId,
      state: body.state,
      homeAddress: body.homeAddress,
      biodata: {
        genotype: body.genotype,
        gender: body.gender,
        maritalStatus: body.maritalStatus,
        bloodGroup: body.bloodGroup,
      },
    });

    return patient.populate("user");
  }

  public async getPatientById(patientId: string): Promise<PatientDocument> {
    const patient = await this.patientModel
      .findOne<PatientDocument>({
        _id: patientId,
      })
      .populate("user");
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

    const record_id = await this.generateRecord();

    const record = await this.appointmentModel.create({
      doctor: doctor.id,
      hospital: doctor.hospital,
      department: doctor.department,
      patient: patientId,
      record_id,
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
    departmentId?: string;
    from?: Date;
    to?: Date;
  }): Promise<AppointmentDocument[]> {
    const { patientId, hospitalId, from, to, departmentId } = body;
    const filter: any = { patient: patientId };
    if (hospitalId) {
      filter.hospital = hospitalId;
    }
    if (departmentId) {
      filter.department = departmentId;
    }

    if (from && to) {
      filter.date = {
        $gte: from,
        $lte: to,
      };
    }
    const records = await this.appointmentModel
      .find<AppointmentDocument>(filter)
      .populate({ path: "doctor", populate: "user" });
    return records;
  }

  public async forwardToDepartment(
    recordId: string,
    departmentId: string
  ): Promise<void> {
    const record = await this.appointmentModel.findOne<AppointmentDocument>({
      _id: recordId,
    });

    const doctors = await this.doctorModel.find<DoctorDocument>({
      department: departmentId,
    });
    for (const doctor of doctors) {
      const user = doctor.user as string;
      await this.notificationService.createNotification({
        title: "Patient Forwarded",
        body: `Patient record with id of ${record.record_id} has been forwarded to you, kindly look into it `,
        user: user,
      });
    }
  }

  public async searchByRecordId(
    recordId: string
  ): Promise<AppointmentDocument[]> {
    const results = await this.appointmentModel
      .find<AppointmentDocument>({
        $text: { $search: recordId },
      })
      .populate("department")
      .populate("hospital")
      .populate({
        path: "doctor",
        populate: "user",
      })
      .populate({
        path: "patient",
        populate: "user",
      });
    return results;
  }

  public async searchDiagnosis(term: string, patientId: string) {
    const records = await this.appointmentModel.find<AppointmentDocument>({
      patient: patientId,
    });
    const results = [];
    for (const record of records) {
      const match = this.aiService.analyzeArrayText(record.doctorsReport, term);
      if (match) {
        results.push(record);
      }
    }
    return results;
  }
}
