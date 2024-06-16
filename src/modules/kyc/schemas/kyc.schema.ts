import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { KYCFile, KYCFileSchema } from "./kyc.file.schema";
import {
  Hospital,
  HospitalDocument,
} from "../../hospital/schemas/hospital.schema";
import { User, UserDocument } from "../../user/schemas";
import { Document } from "mongoose";
import { KycEnums } from "../enums/kyc.enums";

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
export class KYC {
  @ApiProperty()
  @Prop({
    type: String,
    ref: Hospital.name,
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
    type: KYCFileSchema,
  })
  file: KYCFile;

  @ApiProperty()
  @Prop({
    type: String,
    enum: Object.values(KycEnums),
  })
  kycType: KycEnums;

  @ApiProperty()
  @Prop({ type: Boolean, default: true })
  uploaded: boolean;
}

export type KYCDocument = KYC & Document;
export const KYCSchema = SchemaFactory.createForClass(KYC);
