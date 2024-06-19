import { v4 as uuidv4 } from "uuid";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";
import { Hospital, HospitalDocument } from "./hospital.schema";
import { DoctorDocument } from "../../department/schema/doctor.schema";
import { Patient, PatientDocument } from "../../patient/schemas/patient.schema";

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
}
