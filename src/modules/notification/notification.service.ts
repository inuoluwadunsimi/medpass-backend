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

  public async createNotification(body: {
    title: string;
    body: string;
    user: string;
  }): Promise<NotificationDocument> {
    return await this.notificationModel.create(body);
  }

  public async getNotifications(user: string): Promise<NotificationDocument[]> {
    return await this.notificationModel.find({ user });
  }

  public async getSingleNotificaton(
    notificationId: string
  ): Promise<NotificationDocument> {
    const notification = await this.notificationModel.findById(notificationId);
    if (!notification) {
      throw new NotFoundException("notification not found");
    }
    return notification;
  }
}
