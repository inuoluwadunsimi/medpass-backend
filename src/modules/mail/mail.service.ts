import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { EmailInterface } from "./mail.interface";
import * as path from "node:path";
import fs from "fs";
import { ConfigService } from "@nestjs/config";
const templateDir = path.join(__dirname, "templates");

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  private async sendMail(body: EmailInterface) {
    try {
      await this.mailerService.sendMail(body);
    } catch (err) {
      console.log(err);
    }
  }

  public async sendOtpMail(
    email: string,
    otp: string,
    name: string
  ): Promise<void> {
    const templatePath = path.join(templateDir, "otp.email.html");
    const templateSource = fs.readFileSync(templatePath, "utf8");
    const html = templateSource
      .replace(/{{otp}}/g, otp)
      .replace(/{{name}}/g, name);
    await this.sendMail({
      to: email,
      subject: "OTP for registration",
      html: html,
    });
  }

  public async sendInviteEmail(
    email: string,
    hospitalName: string,
    token: string
  ): Promise<void> {
    const templatePath = path.join(templateDir, "invite.email.html");
    const templateSource = fs.readFileSync(templatePath, "utf8");
    const html = templateSource
      .replace(/{{name}}/g, hospitalName)
      .replace(
        /{{verificatonLink}}/g,
        `${this.configService.get<string>("FRONTEND_URL")}/auth/invite/${token}`
      );
    await this.sendMail({
      to: email,
      subject: "MEDPASS INVITATION",
      html: html,
    });
  }
}
