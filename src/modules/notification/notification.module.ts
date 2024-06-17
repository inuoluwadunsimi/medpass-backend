import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { NotificationSchema, Notification } from "./schema/notification.schema";
import { User, UserSchema } from "../user/schemas";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
