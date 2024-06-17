import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";
import { User, UserDocument } from "../../user/schemas";
import { Patient, PatientDocument } from "./patient.schema";
import { Doctor, DoctorDocument } from "../../department/schema/doctor.schema";
import {
  Hospital,
  HospitalDocument,
} from "../../hospital/schemas/hospital.schema";
import {
  Department,
  DepartmentDocument,
} from "../../department/schema/department.schema";

@Schema({ _id: false })
export class Prescription {
  @ApiProperty()
  @Prop({ type: String })
  name: string;

  @ApiProperty()
  @Prop({ type: String })
  mg: string;

  @ApiProperty()
  @Prop({ type: String })
  measurement: string;

  @ApiProperty()
  @Prop({ type: String })
  frequency: string;
}
export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);

export class Treatment {
  @ApiProperty()
  @Prop({ type: String })
  name: string;

  @ApiProperty()
  @Prop({ type: String })
  description: string;
}

export const TreatmentSchema = SchemaFactory.createForClass(Treatment);

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
export class Appointment {
  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  _id: string;

  @ApiProperty()
  @Prop({
    required: true,
    ref: Patient.name,
    type: String,
  })
  patient: string | PatientDocument;

  @ApiProperty()
  @Prop({
    required: true,
    ref: Doctor.name,
    type: String,
  })
  doctor: string | DoctorDocument;

  @ApiProperty()
  @Prop({
    required: true,
    ref: Hospital.name,
    type: String,
  })
  hospital: string | HospitalDocument;

  @ApiProperty()
  @Prop({
    required: true,
    ref: Department.name,
    type: String,
  })
  department: string | DepartmentDocument;

  @ApiProperty()
  @Prop({
    required: true,
    type: Date,
    default: new Date(),
  })
  date: Date;

  @ApiProperty()
  @Prop({
    required: true,
    type: [String],
  })
  complaint: String[];

  @ApiProperty()
  @Prop({
    required: true,
    type: [String],
  })
  doctorsReport: String[];

  @ApiProperty()
  @Prop({
    type: [Prescription],
  })
  prescription: Prescription[];

  @ApiProperty()
  @Prop({
    type: [Treatment],
  })
  treatment: Treatment[];
}

export type AppointmentDocument = Appointment & Document;
export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
