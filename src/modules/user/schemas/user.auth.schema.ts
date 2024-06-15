import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// this import helps to define the schemas of the models in the swagger docs
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
export class UserAuth {
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
    unique: true,
    type: String,
    lowercase: true,
  })
  email: string;

  @ApiProperty()
  @Prop({
    type: String,
  })
  password: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    ref: User.name,
  })
  user: string | UserDocument;

  @ApiProperty()
  @Prop([
    {
      type: String,
    },
  ])
  recognisedDevices: string[];

  // the isverified is to confirm if a user has done OTP verification
  @ApiProperty()
  @Prop({
    type: Boolean,
    default: false,
  })
  isVerified: boolean;
}

export type UserAuthDocument = UserAuth & Document;

export const UserAuthSchema = SchemaFactory.createForClass(UserAuth);
