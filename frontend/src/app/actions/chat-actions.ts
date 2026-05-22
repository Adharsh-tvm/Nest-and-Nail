"use server";

import { getMessagesApi, sendMessageApi } from "@/sources/api/user/chat.api";

export async function getMessagesAction(chatId: string) {
  try {
    return await getMessagesApi(chatId);
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : String(error) };
  }
}

export async function sendMessageAction(data: { 
  chatId: string; 
  receiverId: string; 
  message: string; 
  attachmentUrl?: string;
  messageType?: string;
}) {
  try {
    return await sendMessageApi(data);
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : String(error) };
  }
}
