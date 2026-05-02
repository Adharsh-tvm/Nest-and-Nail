"use server";

import { getMessagesApi, sendMessageApi } from "@/sources/api/chat.api";

export async function getMessagesAction(chatId: string) {
  try {
    return await getMessagesApi(chatId);
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function sendMessageAction(data: { chatId: string; receiverId: string; message: string }) {
  try {
    return await sendMessageApi(data);
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
