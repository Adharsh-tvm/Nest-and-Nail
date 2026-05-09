import axiosInstance from "@/lib/axiosInstance";
import { CHAT_ROUTES } from "@/sources/constant-api";
import axios from "axios";

export const getMessagesApi = async (chatId: string) => {
  try {
    const res = await axiosInstance.get(CHAT_ROUTES.GET_MESSAGES(chatId));
    return { success: true, data: res.data };
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
    return { success: false, message: message || "Failed to get messages" };
  }
};

export const sendMessageApi = async (data: { chatId: string; receiverId: string; message: string }) => {
  try {
    const res = await axiosInstance.post(CHAT_ROUTES.SEND, data);
    return { success: true, data: res.data };
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
    return { success: false, message: message || "Failed to send message" };
  }
};
