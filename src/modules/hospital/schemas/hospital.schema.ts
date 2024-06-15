import { v4 as uuidv4 } from "uuid";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
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
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
})
export class Hospital {
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
    unique: true,
    type: String,
  })
  email: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  address: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  cac_number: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  phone: string;

  @ApiProperty()
  @Prop({
    type: Boolean,
    default: false,
  })
  kycVerified: boolean;
}

export type HospitalDocument = Hospital & Document;
export const HospitalSchema = SchemaFactory.createForClass(Hospital);
