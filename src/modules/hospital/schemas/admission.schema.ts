import { v4 as uuidv4 } from "uuid";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";
import { Hospital, HospitalDocument } from "./hospital.schema";
import { DoctorDocument } from "../../department/schema/doctor.schema";
import { Patient, PatientDocument } from "../../patient/schemas/patient.schema";
import {
  Department,
  DepartmentDocument,
} from "../../department/schema/department.schema";

export enum AdmissionStatus {
  ADMITTED = "admitted",
  DISCHARGED = "discharged",
}

export class DosageTreatment {
  @ApiProperty()
  @Prop({ type: String })
  name: string;

  @ApiProperty()
  @Prop({ type: String })
  dosage: string;

  @ApiProperty()
  @Prop({ type: String })
  measurement: string;
}

export const DosageTreatmentSchema =
  SchemaFactory.createForClass(DosageTreatment);

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
  toObject: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
})
export class Admission {
  @ApiProperty()
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  _id: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    ref: Hospital.name,
  })
  hospital: HospitalDocument | string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    ref: Hospital.name,
  })
  doctor: DoctorDocument | string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    ref: Patient.name,
  })
  patient: PatientDocument | string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    ref: Department.name,
  })
  department: DepartmentDocument | string;

  @ApiProperty()
  @Prop({
    type: [String],
  })
  complaints: string[];

  @ApiProperty()
  @Prop({
    type: [String],
  })
  symptoms: string[];

  @ApiProperty()
  @Prop({
    type: [String],
  })
  tests: string[];

  @ApiProperty()
  @Prop({
    type: [String],
  })
  diagnosis: string[];

  @ApiProperty()
  @Prop({
    type: DosageTreatment,
  })
  treatment: DosageTreatment;

  @ApiProperty()
  @Prop({
    type: String,
    enum: Object.values(AdmissionStatus),
    default: AdmissionStatus.ADMITTED,
  })
  status: AdmissionStatus;

  @ApiProperty()
  @Prop({
    type: Date,
  })
  admissionDate: Date;
}

export type AdmissionDocument = Admission & Document;
export const AdmissionSchema = SchemaFactory.createForClass(Admission);
