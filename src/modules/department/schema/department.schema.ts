import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";
import {
  Hospital,
  HospitalDocument,
} from "../../hospital/schemas/hospital.schema";
import { Document } from "mongoose";

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
    transform(ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
})
export class Department {
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
    type: String,
    ref: Hospital.name,
    required: true,
  })
  hospital: HospitalDocument | string;

  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  departmentName: string;

  @ApiProperty()
  @Prop({
    type: String,
    required: false,
  })
  departmentEmail: string;

  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  description: string;
}

export type DepartmentDocument = Department & Document;
export const DepartmentSchema = SchemaFactory.createForClass(Department);
