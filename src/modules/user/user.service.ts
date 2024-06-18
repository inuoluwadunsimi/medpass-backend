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

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserAuth.name) private userAuthModel: Model<UserAuthDocument>,
    @InjectModel(UserToken.name)
    private userTokenModel: Model<UserTokenDocument>,
    private readonly jwtHelper: JwtHelper
  ) {}

  public async createUser(user: Partial<UserDocument>): Promise<UserDocument> {
    return this.userModel.create(user);
  }

  public async getUserProfile(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException("user does not exist");
    }
    return user;
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
