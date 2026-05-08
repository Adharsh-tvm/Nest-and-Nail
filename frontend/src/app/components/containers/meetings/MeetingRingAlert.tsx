"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import { useUserStore } from "@/store/userStore";
import { Video, PhoneOff } from "lucide-react";

interface MeetingRingAlertProps {
  serviceId: string;
  role: "CLIENT" | "WORKER";
  callerName: string;
}

export default function MeetingRingAlert({
  serviceId,
  role,
  callerName,
}: MeetingRingAlertProps) {
  const { user } = useUserStore();
  const router = useRouter();

  const [isRinging, setIsRinging] = useState(false);
  const [mounted, setMounted] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const ringIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Mount guard for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // ─── Bell synth ──────────────────────────────────────────────────────────────
  const playBell = useCallback(async () => {
    try {
      // Create or reuse AudioContext
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;

      // Must resume if suspended (browser autoplay policy)
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const now = ctx.currentTime;

      // Four-note bell: ding-ding-ding-DONG
      const notes = [
        { freq: 880,  start: 0,    dur: 0.20 },
        { freq: 1100, start: 0.25, dur: 0.20 },
        { freq: 880,  start: 0.50, dur: 0.20 },
        { freq: 1320, start: 0.75, dur: 0.30 },
      ];

      notes.forEach(({ freq, start, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + start);
        gain.gain.setValueAtTime(0.6, now + start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + dur + 0.05);
      });
    } catch (e) {
      console.warn("[MeetingRingAlert] Audio error:", e);
    }
  }, []);

  // ─── Start / Stop ringing ────────────────────────────────────────────────────
  const stopRinging = useCallback(() => {
    setIsRinging(false);
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const startRinging = useCallback(() => {
    setIsRinging(true);

    // Play immediately then loop every 1.8 s
    playBell();
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    ringIntervalRef.current = setInterval(() => {
      playBell();
    }, 1800);

    // Auto-dismiss after 30 s
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => {
      stopRinging();
    }, 30000);
  }, [playBell, stopRinging]);

  // ─── Socket listener ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const socket = io(apiUrl, {
      transports: ["websocket", "polling"],
      // Use a unique namespace tag so this socket is independent
      query: { component: "ring-alert" },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      // Register this user so the backend can push notifications here
      socket.emit("register", user.id);
      console.log("[MeetingRingAlert] socket connected, registered userId:", user.id);
    });

    socket.on("notification", (notification: { type: string; data?: any }) => {
      console.log("[MeetingRingAlert] notification received:", notification);
      if (
        notification.type === "MEETING_JOINED" &&
        notification.data?.serviceId === serviceId
      ) {
        startRinging();
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      stopRinging();
    };
  }, [user?.id, serviceId, startRinging, stopRinging]);

  // Cleanup AudioContext on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // ─── Actions ─────────────────────────────────────────────────────────────────
  const handleAccept = () => {
    stopRinging();
    const path =
      role === "CLIENT"
        ? `/client/video-call/${serviceId}`
        : `/worker/video-call/${serviceId}`;
    router.push(path);
  };

  const handleDecline = () => {
    stopRinging();
  };

  // Don't render until mounted (portal needs document.body) and ringing
  if (!mounted || !isRinging) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      {/* Dark blurred backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-lg" />

      {/* Ripple rings behind the card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="absolute w-72 h-72 rounded-full border-[3px] border-emerald-400/50 animate-ping" />
        <span
          className="absolute w-56 h-56 rounded-full border-[3px] border-emerald-400/35 animate-ping"
          style={{ animationDelay: "0.4s" }}
        />
        <span
          className="absolute w-44 h-44 rounded-full border-[3px] border-emerald-400/20 animate-ping"
          style={{ animationDelay: "0.8s" }}
        />
      </div>

      {/* Modal card */}
      <div className="relative z-10 flex flex-col items-center gap-7 bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 rounded-3xl px-10 py-10 shadow-2xl shadow-black/60 max-w-sm w-full mx-4 text-center">

        {/* Animated bell icon */}
        <div className="relative">
          <div
            className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/50"
            style={{ animation: "ringShake 0.6s ease-in-out infinite alternate" }}
          >
            <Video className="w-14 h-14 text-white drop-shadow-lg" />
          </div>
          {/* Green "live" dot */}
          <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-400 rounded-full border-4 border-slate-900 animate-pulse" />
        </div>

        {/* Label */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-emerald-400 tracking-[0.2em] uppercase">
            Incoming Video Call
          </p>
          <h2 className="text-2xl font-extrabold text-white leading-tight">
            {callerName}
          </h2>
          <p className="text-slate-400 text-sm">
            has joined the meeting room and is waiting for you
          </p>
        </div>

        {/* Bouncing dots (loading indicator) */}
        <div className="flex items-center gap-2">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-8">
          {/* Decline */}
          <button
            onClick={handleDecline}
            className="flex flex-col items-center gap-2.5 group"
            aria-label="Dismiss ring"
          >
            <div className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-95 flex items-center justify-center shadow-xl shadow-rose-500/40 transition-all duration-200">
              <PhoneOff className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs font-medium text-slate-400 group-hover:text-rose-400 transition-colors">
              Dismiss
            </span>
          </button>

          {/* Accept */}
          <button
            onClick={handleAccept}
            className="flex flex-col items-center gap-2.5 group"
            aria-label="Join the meeting"
          >
            <div
              className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 flex items-center justify-center shadow-xl shadow-emerald-500/50 transition-all duration-200"
              style={{ animation: "ringPulse 1s ease-in-out infinite" }}
            >
              <Video className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
              Join Now
            </span>
          </button>
        </div>
      </div>

      {/* Inline keyframe animations */}
      <style>{`
        @keyframes ringShake {
          0%   { transform: rotate(-8deg) scale(1.02); }
          100% { transform: rotate(8deg) scale(1.02); }
        }
        @keyframes ringPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.5); }
          50%       { box-shadow: 0 0 0 14px rgba(52, 211, 153, 0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
