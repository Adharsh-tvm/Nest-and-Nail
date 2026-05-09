import mongoose, { Schema, Document } from "mongoose";

export interface NotificationDocument extends Document {
  notificationId: string;
  userId: string;

  title: string;
  message: string;
  type: string;

  data?: Record<string, unknown>;

  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>({
  notificationId: { type: String, required: true },

  userId: { type: String, required: true, index: true },

  title: { type: String, required: true },
  message: { type: String, required: true },

  type: { type: String, required: true },

  data: { type: Schema.Types.Mixed },

  isRead: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

export const NotificationModel = mongoose.model("Notification", NotificationSchema);