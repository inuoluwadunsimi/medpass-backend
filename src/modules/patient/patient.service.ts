import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isEmpty } from "lodash";
import { Patient, PatientDocument } from "./schemas/patient.schema";
import { Model } from "mongoose";

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>
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

  public async getPatientById(patientId: string): Promise<PatientDocument[]> {
    const results = await this.patientModel.find<PatientDocument>({
      $text: { $search: patientId },
    });
    return results;
  }
}
