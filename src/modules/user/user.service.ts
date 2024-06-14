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
import randomString from "randomstring";
import { AuthResponse } from "../auth/interfaces/auth.responses";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserAuth.name) private userAuthModel: Model<UserAuthDocument>,
    @InjectModel(UserToken.name)
    private userTokenModel: Model<UserTokenDocument>
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

  async saveUserToken(
    user: UserDocument,
    deviceId: string,
    accessToken: string,
    refreshToken?: string
  ): Promise<AuthResponse> {
    await this.userTokenModel.updateOne(
      { email: user.email },
      {
        deviceId,
        accessToken,
        refreshToken,
        user: user.id,
      },
      { upsert: true }
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
