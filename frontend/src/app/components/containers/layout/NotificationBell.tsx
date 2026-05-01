"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Bell, BellRing, X, Check, CheckCheck } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { getNotificationsAction, markNotificationReadAction } from "@/app/actions/notification-actions";
import io, { Socket } from "socket.io-client";

interface NotificationDTO {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const { user } = useUserStore();
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Fetch initial notifications from the server
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const res = await getNotificationsAction();
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time socket subscription
  useEffect(() => {
    if (!user?.id) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const socket = io(apiUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      // Register this user so the server can push to them
      socket.emit("register", user.id);
    });

    socket.on("notification", (notification: NotificationDTO) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.id]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await markNotificationReadAction(notificationId);
    if (res.success) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        )
      );
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    for (const n of unread) {
      await markNotificationReadAction(n.notificationId);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SERVICE_BOOKED":
        return "🔧";
      case "MEETING_BOOKED":
        return "📹";
      default:
        return "🔔";
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <BellRing size={22} className="text-[#1B4332] animate-pulse" />
        ) : (
          <Bell size={22} className="text-gray-500 group-hover:text-[#1B4332] transition-colors" />
        )}

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          id="notification-dropdown"
          className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[200] animate-in fade-in zoom-in-95 duration-200 origin-top-right"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/70">
            <div className="flex items-center gap-2">
              <BellRing size={16} className="text-[#1B4332]" />
              <span className="text-sm font-bold text-gray-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-[#1B4332] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                  className="p-1 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-[#1B4332] transition-colors"
                >
                  <CheckCheck size={15} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[360px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-5 h-5 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
                <Bell size={32} className="opacity-30" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {notifications.map((notification) => (
                  <li
                    key={notification.notificationId}
                    className={`relative flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group cursor-default ${
                      !notification.isRead ? "bg-emerald-50/50" : ""
                    }`}
                  >
                    {/* Unread dot */}
                    {!notification.isRead && (
                      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#1B4332] rounded-full flex-shrink-0" />
                    )}

                    <span className="text-lg flex-shrink-0 mt-0.5">
                      {getTypeIcon(notification.type)}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold text-gray-800 truncate ${!notification.isRead ? "text-[#1B4332]" : ""}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>

                    {/* Mark as read button */}
                    {!notification.isRead && (
                      <button
                        onClick={(e) => handleMarkRead(notification.notificationId, e)}
                        title="Mark as read"
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-[#1B4332]/10 text-[#1B4332] transition-all flex-shrink-0"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50 text-center">
              <p className="text-[11px] text-gray-400">
                {notifications.length} total notification{notifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
