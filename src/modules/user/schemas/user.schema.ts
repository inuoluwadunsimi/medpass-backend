import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";
import { UserRole } from "../interfaces/user.enums";
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
export class User {
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
    required: false,
    type: String,
  })
  firstName: string;

  @ApiProperty()
  @Prop({
    required: false,
    type: String,
  })
  lastName: string;

  @ApiProperty()
  @Prop({
    required: false,
    type: String,
  })
  phoneNumber: string;

  @ApiProperty()
  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.DOCTOR,
  })
  role: UserRole;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User).set(
  "versionKey",
  false
);
