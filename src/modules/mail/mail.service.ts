import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: "Welcome to Our Service! Confirm your Email",
      template: "./confirmation", // The name of the template file in the templates folder
      context: {
        // Data to be sent to template engine
        token,
      },
    });
  }
}
