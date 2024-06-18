import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// this import helps to define the schemas of the models in the swagger docs
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";
import { Document } from "mongoose";

export enum OtpType {
  SIGN_UP = "SIGNUP",
  LOGIN = "LOGIN",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
}

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
export class Otp {
  // switched to uuids because they are easier to use compared to objectId's
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
    type: String,
    lowercase: true,
  })
  email: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  otp: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  deviceId: string;

  @ApiProperty()
  @Prop({
    type: String,
    enum: Object.values(OtpType),
    default: OtpType.SIGN_UP,
  })
  otpType: OtpType;

  @ApiProperty()
  @Prop({
    type: Date,
    required: true,
    default: Date.now(),
    index: { expires: "10m" },
  })
  expiresAt: Date;
}

export type OtpDocument = Otp & Document;

export const OtpSchema = SchemaFactory.createForClass(Otp);
