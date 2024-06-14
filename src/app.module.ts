import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./filters/http.exception.filter";
import * as dotenv from "dotenv";
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>("MAIL_USER"),
            pass: configService.get<string>("GMAIL_PASS"),
          },
        },
        defaults: {
          from: configService.get<string>("MAIL_USER"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
