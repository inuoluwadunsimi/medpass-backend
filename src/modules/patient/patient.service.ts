import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isEmpty } from "lodash";
import { Patient, PatientDocument } from "./schemas/patient.schema";
import { Model } from "mongoose";
import { CreatePatientDto } from "./dtos/create.patient.dto";
import { User, UserDocument } from "../user/schemas";
import { UserRole } from "../user/interfaces/user.enums";

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
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
}
