import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";
import { Document } from "mongoose";
import {
  Hospital,
  HospitalDocument,
} from "../../hospital/schemas/hospital.schema";
import { User, UserDocument } from "../../user/schemas";
import { Department, DepartmentDocument } from "./department.schema";

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
export class Doctor {
  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    default: uuidv4,
  })
  _id: string;

  @ApiProperty()
  @Prop({
    type: String,
    ref: Hospital.name,
    required: true,
  })
  hospital: HospitalDocument | string;

  @ApiProperty()
  @Prop({
    type: String,
    ref: User.name,
  })
  user: UserDocument | string;

  @ApiProperty()
  @Prop({
    type: String,
    ref: Department.name,
  })
  department: DepartmentDocument | string;
}

export type DoctorDocument = Doctor & Document;
export const DoctorSchema = SchemaFactory.createForClass(Doctor);
