"use client";

import React, { useEffect, useState, useRef } from "react";
import { X, Send, MessageCircle, Smile, Paperclip, CheckCheck, User } from "lucide-react";
import io, { Socket } from "socket.io-client";
import { getMessagesAction, sendMessageAction } from "@/app/actions/chat-actions";
import { useUserStore } from "@/store/userStore";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { getMediaUploadUrlAction } from "@/app/actions/media/mediaUpload.actions";
import { uploadToS3 } from "@/lib/uploadToS3";

// Dynamically import EmojiPicker to prevent SSR hydration mismatches
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface Message {
  messageId?: string;
  senderId: string;
  receiverId: string;
  message: string;
  attachmentUrl?: string;
  messageType?: string;
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const isImage = file.type.startsWith("image/");
    const messageType = isImage ? "image" : "file";

    const toastId = toast.loading("Uploading attachment...");
    try {
      // 1. Get presigned upload URL and immediate signed preview Url
      const response = await getMediaUploadUrlAction(file.name, file.type);
      if (!response.success || !response.payload) {
        toast.error(response.message || "Failed to get upload URL", { id: toastId });
        return;
      }

      const { uploadUrl, fileUrl, signedUrl } = response.payload;

      // 2. Upload the file to S3
      const uploadSuccess = await uploadToS3(file, uploadUrl);
      if (!uploadSuccess) {
        toast.error("Failed to upload file to S3", { id: toastId });
        return;
      }

      // 3. Prepare the message payload
      const messageData: Message = {
        senderId: user.id,
        receiverId,
        message: messageType === "image" ? "" : file.name,
        attachmentUrl: signedUrl || fileUrl,
        messageType,
        createdAt: new Date().toISOString(),
      };

      // Emit via socket immediately with the preview Url
      socketRef.current?.emit("send-message", {
        chatId,
        message: messageData,
      });

      // Save to database using the permanent fileUrl key
      await sendMessageAction({
        chatId,
        receiverId,
        message: messageType === "image" ? "" : file.name,
        attachmentUrl: fileUrl,
        messageType,
      });

      // Clean up the file input
      if (fileInputRef.current) fileInputRef.current.value = "";

      toast.success("Attachment sent!", { id: toastId });
    } catch (err) {
      console.error("Error sending attachment:", err);
      toast.error("Failed to send attachment", { id: toastId });
    }
  };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Ref to track isOpen without stale closures inside socket callbacks
  const isOpenRef = useRef(false);

  const userIdRef = useRef(user?.id);
  useEffect(() => {
    userIdRef.current = user?.id;
  }, [user?.id]);

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
      if (message.senderId !== userIdRef.current && !isOpenRef.current) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [chatId, userIdRef]);

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

    setNewMessage("");
    setShowEmojiPicker(false);

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

  const onEmojiClick = (emojiData: { emoji: string }) => {
    const emoji = emojiData.emoji;
    const input = inputRef.current;
    
    if (input) {
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      const text = newMessage;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      
      setNewMessage(before + emoji + after);
      
      // Keep input focused and move cursor directly after the newly inserted emoji
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 10);
    } else {
      setNewMessage((prev) => prev + emoji);
    }
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
        <div className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[520px] bg-white rounded-3xl shadow-2xl border border-gray-200 z-[9999] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#1B4332] text-white px-5 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/10">
                <User size={20} className="text-emerald-50" />
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
                <MessageCircle size={40} className="opacity-20 text-[#1B4332]" />
                <p className="text-sm font-medium">No messages yet. Say hi!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={index} className={`flex flex-col max-w-[85%] ${isMe ? "self-end items-end" : "self-start items-start"}`}>
                    <div className={`px-4 py-2.5 text-[15px] shadow-sm ${isMe ? "bg-[#1B4332] text-white rounded-2xl rounded-br-sm animate-in fade-in slide-in-from-right-2 duration-150" : "bg-white border border-gray-100 text-slate-800 rounded-2xl rounded-bl-sm animate-in fade-in slide-in-from-left-2 duration-150"}`}>
                      {msg.messageType === "image" && msg.attachmentUrl ? (
                        <div className="max-w-[240px]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={msg.attachmentUrl} 
                            alt="Attachment" 
                            className="rounded-lg max-h-[180px] object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                            onClick={() => window.open(msg.attachmentUrl, "_blank")}
                          />
                        </div>
                      ) : msg.messageType === "file" && msg.attachmentUrl ? (
                        <a 
                          href={msg.attachmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 hover:underline font-bold"
                        >
                          <Paperclip size={16} />
                          <span className="truncate max-w-[180px]">{msg.message || "View Attachment"}</span>
                        </a>
                      ) : (
                        msg.message
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1 font-medium">
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && <CheckCheck size={12} className="text-emerald-500" />}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Emoji Section */}
          <div className="p-3 bg-white border-t border-slate-100 relative">
            {/* Floating Emoji Picker Popover */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-4 right-4 z-[10000] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200">
                <div className="flex justify-between items-center px-4 py-2 border-b border-slate-100 bg-slate-50">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <Smile size={14} className="text-[#1B4332]" /> Express Yourself
                  </span>
                  <button 
                    type="button"
                    onClick={() => setShowEmojiPicker(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
                <div className="h-[250px] overflow-hidden">
                  <EmojiPicker 
                    onEmojiClick={onEmojiClick}
                    width="100%"
                    height="100%"
                    skinTonesDisabled
                    searchDisabled
                    previewConfig={{ showPreview: false }}
                  />
                </div>
              </div>
            )}

            <form onSubmit={handleSend} className="flex items-center gap-2">
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              />

              {/* Attachment Option */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors shrink-0"
                title="Attach File"
              >
                <Paperclip size={18} />
              </button>

              <div className="flex-1 bg-slate-100 rounded-full flex items-center px-4 py-1 border border-transparent focus-within:border-[#1B4332] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1B4332]/10 transition-all shadow-inner relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    if (showEmojiPicker) setShowEmojiPicker(false);
                  }}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent py-2.5 text-[15px] outline-none text-slate-800"
                />
                
                {/* Emoji Toggle Option */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors shrink-0 ${showEmojiPicker ? "text-[#1B4332] bg-[#1B4332]/10" : "text-slate-400 hover:text-[#1B4332]"}`}
                  title="Emojis"
                >
                  <Smile size={20} />
                </button>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="w-11 h-11 flex-shrink-0 bg-[#1B4332] text-white rounded-full flex items-center justify-center hover:bg-[#153426] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all shadow-md"
              >
                <Send size={16} className="ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

