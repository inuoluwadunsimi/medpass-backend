import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  User,
  UserAuthDocument,
  UserDocument,
  UserAuth,
  UserTokenDocument,
  UserToken,
} from "./schemas";
import * as randomString from "randomstring";
import { AuthResponse } from "../auth/interfaces/auth.responses";
import { JwtHelper } from "../auth/jwt/jwt.helper";
import { GenerateTokenParam } from "../auth/jwt/jwt.interface";
import { SaveToken } from "./interfaces/user.requests";
import { UserRole } from "./interfaces/user.enums";
import {
  Hospital,
  HospitalDocument,
} from "../hospital/schemas/hospital.schema";
import { Doctor, DoctorDocument } from "../department/schema/doctor.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserAuth.name) private userAuthModel: Model<UserAuthDocument>,
    @InjectModel(UserToken.name)
    private userTokenModel: Model<UserTokenDocument>,
    @InjectModel(Hospital.name) private hospitalModel: Model<HospitalDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    private readonly jwtHelper: JwtHelper
  ) {}

  public async createUser(user: Partial<UserDocument>): Promise<UserDocument> {
    return this.userModel.create(user);
  }

  public async getUserProfile(userId: string): Promise<any> {
    let finalUser: any;
    const user = await this.userModel.findOne<UserDocument>({ _id: userId });
    if (!user) {
      throw new NotFoundException("user does not exist");
    }
    if (user.role === UserRole.ADMIN) {
      const hospital = await this.hospitalModel.findOne<HospitalDocument>({
        created_by: userId,
      });
      finalUser = { ...user, hospital: hospital.id };
    }
    if (user.role === UserRole.DOCTOR) {
      const doctor = await this.doctorModel.findOne<DoctorDocument>({ user });
      finalUser = {
        ...user,
        hospital: doctor.hospital,
        department: doctor.department,
      };
    }
    return finalUser;
  }

  public generateOtp(): string {
    return randomString.generate({
      length: 6,
      charset: "numeric",
    });
  }

  async saveUserToken(body: SaveToken): Promise<AuthResponse> {
    const { email, userId, type, deviceId, role, user } = body;
    const token = this.jwtHelper.generateToken({
      email,
      userId,
      type,
      deviceId,
      role,
    });

    await this.userTokenModel.updateOne(
      { email: email },
      {
        deviceId,
        ...token,
        user: user.id,
      },
      { upsert: true }
    );

    return {
      user,
      ...token,
    };
  }
}
