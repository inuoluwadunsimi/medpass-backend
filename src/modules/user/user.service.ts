import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserAuthDocument, UserDocument, UserAuth } from "./schemas";
import randomString from "randomstring";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserAuth.name) private userAuthModel: Model<UserAuthDocument>
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
}
