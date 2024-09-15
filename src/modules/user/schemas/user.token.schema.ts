import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from "uuid";
import { Document } from "mongoose";
import { User, UserDocument } from "./user.schema";

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
export class UserToken {
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
    trim: true,
  })
  email: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  accessToken: string;

  @ApiProperty()
  @Prop({
    required: false,
    type: String,
  })
  refreshToken: string;

  // tokens should be signed with email, userid and deviceId
  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  deviceId: string;

  @ApiProperty()
  @Prop({
    type: String,
    ref: User.name,
    required: true,
  })
  user: string | UserDocument;
}

export type UserTokenDocument = UserToken & Document;

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
