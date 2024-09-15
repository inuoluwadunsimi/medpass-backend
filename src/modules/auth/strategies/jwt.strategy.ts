import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { GenerateTokenParam } from "../jwt/jwt.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel("UserToken") private readonly UserTokenDb: Model<any>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader("x-auth-token"),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_PRIVATE_KEY"),
    });
  }

  async validate(payload: GenerateTokenParam, req: Request) {
    const token = ExtractJwt.fromHeader("x-auth-token")(req);
    const tokenExists = await this.UserTokenDb.findOne({ accessToken: token });
    if (!tokenExists) {
      throw new UnauthorizedException("invalid token");
    }

    return {
      email: payload.email,
      userId: payload.userId,
      deviceId: payload.deviceId,
      type: payload.type,
      role: payload.role,
    };
  }
}
