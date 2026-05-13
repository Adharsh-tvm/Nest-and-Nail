import mongoose, { Schema, Document } from "mongoose";

export interface ChatMessageDocument extends Document {
  messageId: string;
  chatId: string;

  senderId: string;
  receiverId: string;

  message: string;

  isRead: boolean;

  createdAt: Date;
}

const ChatMessageSchema = new Schema<ChatMessageDocument>({
  messageId: { type: String, required: true },

  chatId: { type: String, required: true, index: true },

  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },

  message: { type: String, required: true },

  isRead: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

export const ChatMessageModel = mongoose.model("ChatMessage", ChatMessageSchema);