import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { GenerateTokenParam, JwtType } from "./jwt.interface";
import { ConfigService } from "@nestjs/config";
import { UserToken, UserTokenDocument } from "../../user/schemas";

@Injectable()
export class JwtHelper {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(UserToken.name)
    private readonly UserTokenDb: Model<UserTokenDocument>
  ) {}

  public generateToken(body: GenerateTokenParam): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = {
      ...body,
    };

    let expiresIn: number;
    switch (body?.type) {
      case JwtType.USER:
        expiresIn = 2592000; // 30 days
        break;

      case JwtType.ADMIN:
        expiresIn = 21600; // 6 hours
        break;

      case JwtType.HOD:
        expiresIn = 21600; // 6 hours
        break;

      case JwtType.DOCTOR:
        expiresIn = 21600; // 6 hours
        break;

      case JwtType.PASSWORD_RESET:
        expiresIn = 1800; // 30 minutes
        break;
      default:
        throw new Error("This type is not supported");
    }

    const secret = this.configService.get<string>("JWT_PRIVATE_KEY");

    const accessToken = this.jwtService.sign(payload, { expiresIn, secret });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: 2592000,
      secret,
    });
    return { accessToken, refreshToken };
  }

  public verifyToken(token: string): GenerateTokenParam {
    return this.jwtService.verify(token, {
      secret: `${this.configService.get<string>("JWT_PRIVATE_KEY")}`,
    }) as GenerateTokenParam;
  }
}
