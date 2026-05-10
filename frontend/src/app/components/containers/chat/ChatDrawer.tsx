"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import io, { Socket } from "socket.io-client";
import { getMessagesAction, sendMessageAction } from "@/app/actions/chat-actions";
import { useUserStore } from "@/store/userStore";

interface Message {
  messageId?: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string | Date;
}

interface ChatDrawerProps {
  chatId: string;
  receiverId: string;
  receiverName?: string;
}

export default function ChatDrawer({ chatId, receiverId, receiverName }: ChatDrawerProps) {
  const { user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  // Ref to track isOpen without stale closures inside socket callbacks
  const isOpenRef = useRef(false);

  // Initial fetch
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      const res = await getMessagesAction(chatId);
      if (res.success && res.data) {
        setMessages(res.data);
      }
      setIsLoading(false);
    };

    fetchMessages();
  }, [chatId]);

  // Keep isOpenRef in sync with state so socket callbacks always read the latest value
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Socket connection — depends only on chatId so it never reconnects on open/close
  useEffect(() => {
    if (!chatId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const socket = io(apiUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-chat", chatId);
    });

    socket.on("receive-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);

      // Use ref so we always read the current isOpen value, not a stale closure
      if (message.senderId !== user?.id && !isOpenRef.current) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [chatId]);

  // Clear unread count when opening
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageData = {
      senderId: user.id,
      receiverId,
      message: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    // Removed optimistic update to prevent double messages.
    // The message will be added when we receive it back from the socket broadcast.
    setNewMessage("");

    // Emit via socket
    socketRef.current?.emit("send-message", {
      chatId,
      message: messageData,
    });

    // Save to DB
    await sendMessageAction({
      chatId,
      receiverId,
      message: messageData.message,
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-[#1B4332] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#153426] hover:scale-105 transition-all z-[9999] ring-4 ring-[#1B4332]/20"
        >
          <MessageCircle size={28} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-200 z-[9999] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#1B4332] text-white px-5 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[15px]">{receiverName || "Chat"}</span>
                <span className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 bg-slate-50 overflow-y-auto flex flex-col gap-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-8 h-8 border-3 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-slate-400 gap-3">
                <MessageCircle size={40} className="opacity-20" />
                <p className="text-sm">No messages yet. Say hi!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={index} className={`flex flex-col max-w-[85%] ${isMe ? "self-end items-end" : "self-start items-start"}`}>
                    <div className={`px-4 py-2.5 text-[15px] shadow-sm ${isMe ? "bg-[#1B4332] text-white rounded-2xl rounded-br-sm" : "bg-white border border-gray-100 text-slate-800 rounded-2xl rounded-bl-sm"}`}>
                      {msg.message}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 rounded-full px-5 py-3 text-[15px] outline-none transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="w-12 h-12 flex-shrink-0 bg-[#1B4332] text-white rounded-full flex items-center justify-center hover:bg-[#153426] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all shadow-md"
              >
                <Send size={18} className="ml-1" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
