import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";
import { Provider } from "@nestjs/common";

export const CloudinaryProvider: Provider = {
  provide: "Cloudinary",
  useFactory: (configService: ConfigService) => {
    cloudinary.config({
      cloud_name: configService.get("CLOUDINARY_CLOUD_NAME"),
      api_key: configService.get("CLOUDINARY_API_KEY"),
      api_secret: configService.get("CLOUDINARY_API_SECRET"),
    });
    return cloudinary;
  },
  inject: [ConfigService],
};
