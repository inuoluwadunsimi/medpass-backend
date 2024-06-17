import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";
import { Document } from "mongoose";
import { User, UserDocument } from "../../user/schemas";
import { Biodata } from "./biodata.schema";

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
export class Patient {
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
    ref: User.name,
    type: String,
  })
  user: string | UserDocument;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  patientId: string;

  @ApiProperty()
  @Prop({
    type: Biodata,
  })
  biodata: Biodata;
}

export type PatientDocument = Patient & Document;
export const PatientSchema = SchemaFactory.createForClass(Patient);
