import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// this import helps to define the schemas of the models in the swagger docs
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { Document } from 'mongoose';
import { User } from './user.schema';

export enum AuthType {
    EMAIL = 'email',
    GOOGLE = 'google',
    FACEBOOK = 'facebook',
}

export enum userRole {
    USER = 'user',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super admin',
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
    user: string;

    // the recogmised devices field helps to streamline the devices that are permitted to access the account
    // it is gotten by using the req.userAgent in the controller
    // multiple devices can be recognised, unrecognised devices will require
    @ApiProperty()
    @Prop([
        {
            type: String,
        },
    ])
    recognisedDevices: string[];

    @ApiProperty()
    @Prop({
        type: String,
        enum: Object.values(userRole),
        default: userRole.USER,
    })
    role: string;

    @ApiProperty()
    @Prop({
        type: String,
        enum: Object.values(AuthType),
        default: AuthType.EMAIL,
    })
    authType: string;

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

// this does some transformation on the schema so that when you fetch from db, you can access id as
//  .id instead of ._id, this only works  after getting data from db though, find quries and update queires
// still have to be done using ._id
