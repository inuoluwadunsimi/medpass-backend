import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  NotificationDocument,
  Notification,
} from "./schema/notification.schema";
import { Model } from "mongoose";

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>
  ) {}
}
