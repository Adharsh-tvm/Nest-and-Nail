import axiosInstance from "@/lib/axiosInstance";

export const getMessagesApi = async (chatId: string) => {
  try {
    const res = await axiosInstance.get(`/chat/${chatId}`);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to get messages" };
  }
};

export const sendMessageApi = async (data: { chatId: string; receiverId: string; message: string }) => {
  try {
    const res = await axiosInstance.post("/chat/send", data);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to send message" };
  }
};
