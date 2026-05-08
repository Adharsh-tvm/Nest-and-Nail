"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import { createPortal } from "react-dom";
import { Mic, MicOff, Video as VideoIcon, VideoOff, LogOut, Loader2, Users, AlertCircle } from "lucide-react";

export default function VideoCall({ 
  roomId, 
  role, 
  workerName, 
  clientName,
  onJoin,
  onLeave
}: { 
  roomId: string; 
  role: string; 
  workerName?: string; 
  clientName?: string;
  onJoin?: (roomId: string) => Promise<any>;
  onLeave?: (roomId: string) => Promise<any>;
}) {
  const myName = role === "WORKER" ? (workerName || "Worker") : (clientName || "Client");
  const otherName = role === "WORKER" ? (clientName || "Client") : (workerName || "Worker");
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Buffer ICE candidates that arrive before remoteDescription is set
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);

  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [connectionState, setConnectionState] = useState<"connecting" | "waiting" | "connected" | "duplicate">("connecting");
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Flush any ICE candidates buffered before remoteDescription was ready
  const flushPendingCandidates = async (pc: RTCPeerConnection) => {
    console.log(`[ICE] Flushing ${pendingCandidates.current.length} buffered candidates`);
    for (const c of pendingCandidates.current) {
      try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch (e) { console.warn("ICE flush error:", e); }
    }
    pendingCandidates.current = [];
  };

  const playRemoteVideo = useCallback(() => {
    const vid = remoteVideo.current;
    if (!vid) return;
    vid.play().catch((e) => console.warn("Remote video play() failed:", e));
  }, []);

  const createPeerConnection = useCallback((socket: Socket): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
      ],
    });

    // Add all local tracks
    localStreamRef.current?.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current!);
    });

    pc.ontrack = (event) => {
      console.log("[ontrack] track received, kind:", event.track.kind);
      const stream = event.streams[0];
      if (remoteVideo.current && stream) {
        remoteVideo.current.srcObject = stream;
        playRemoteVideo();
        setConnectionState("connected");
      }

      // Some browsers start tracks muted — unmute triggers when media actually flows
      event.track.onunmute = () => {
        console.log("[ontrack] track unmuted:", event.track.kind);
        if (remoteVideo.current) {
          playRemoteVideo();
          setConnectionState("connected");
        }
      };
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { roomId, candidate: event.candidate });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("[ICE] state:", pc.iceConnectionState);
      if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
        setConnectionState("connected");
        playRemoteVideo();
      } else if (pc.iceConnectionState === "disconnected" || pc.iceConnectionState === "failed") {
        setConnectionState("waiting");
        if (remoteVideo.current) remoteVideo.current.srcObject = null;
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("[RTC] connectionState:", pc.connectionState);
    };

    return pc;
  }, [roomId, playRemoteVideo]);

  useEffect(() => {
    setMounted(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const socket = io(apiUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    if (onJoin) {
      onJoin(roomId).catch(err => console.error("Error calling join API:", err));
    }

    const start = async () => {
      try {
        // 1. Get media first
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideo.current) localVideo.current.srcObject = stream;

        // 2. Register ALL socket listeners before joining
        socket.on("waiting", () => {
          setConnectionState("waiting");
        });

        socket.on("waiting-for-offer", () => {
          setConnectionState("waiting");
        });

        socket.on("duplicate-tab", () => {
          setConnectionState("duplicate");
          localStreamRef.current?.getTracks().forEach((track) => track.stop());
          pcRef.current?.close();
          socket.disconnect();
        });

        // First user creates offer when second user joins
        socket.on("start-call", async () => {
          console.log("[socket] start-call → creating offer as initiator");
          try {
            pendingCandidates.current = [];
            const pc = createPeerConnection(socket);
            pcRef.current = pc;
            const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
            await pc.setLocalDescription(offer);
            socket.emit("offer", { roomId, offer });
          } catch (err) {
            console.error("Error creating offer:", err);
          }
        });

        // Second user receives offer, creates answer
        socket.on("offer", async (offer: RTCSessionDescriptionInit) => {
          console.log("[socket] received offer → creating answer");
          try {
            pendingCandidates.current = [];
            const pc = createPeerConnection(socket);
            pcRef.current = pc;
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            // Flush any ICE candidates that arrived while we were setting up
            await flushPendingCandidates(pc);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("answer", { roomId, answer });
          } catch (err) {
            console.error("Error handling offer:", err);
          }
        });

        // Initiator receives answer
        socket.on("answer", async (answer: RTCSessionDescriptionInit) => {
          console.log("[socket] received answer");
          try {
            const pc = pcRef.current;
            if (pc && pc.signalingState !== "stable") {
              await pc.setRemoteDescription(new RTCSessionDescription(answer));
              // Flush buffered ICE candidates now that remoteDescription is set
              await flushPendingCandidates(pc);
            }
          } catch (err) {
            console.error("Error handling answer:", err);
          }
        });

        // Trickle ICE candidates with buffering for timing safety
        socket.on("ice-candidate", async (candidate: RTCIceCandidateInit) => {
          const pc = pcRef.current;
          if (!pc) return;
          if (pc.remoteDescription && pc.remoteDescription.type) {
            try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); }
            catch (e) { console.warn("addIceCandidate error:", e); }
          } else {
            // remoteDescription not set yet — buffer and apply later
            console.log("[ICE] buffering candidate (remoteDescription not ready)");
            pendingCandidates.current.push(candidate);
          }
        });

        socket.on("user-left", () => {
          console.log("[socket] user-left");
          setConnectionState("waiting");
          if (remoteVideo.current) remoteVideo.current.srcObject = null;
          pcRef.current?.close();
          pcRef.current = null;
          pendingCandidates.current = [];
        });

        // When the other participant joins the room, mark as connected immediately
        socket.on("user-joined-ring", () => {
          setConnectionState("connected");
        });

        // 3. Join room AFTER all listeners are in place
        socket.emit("join-room", { roomId, userId: `${role}-${socket.id}`, role });

      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    start();

    return () => {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      pcRef.current?.close();
      socket.emit("leave-room", { roomId, userId: role });
      socket.disconnect();
    };
  }, [roomId, role, createPeerConnection]);

  const onBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "Are you sure you want to leave the meeting room?";
  }, []);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      setShowLeaveModal(true);
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [onBeforeUnload]);

  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) { track.enabled = !track.enabled; setIsMicOn(track.enabled); }
  };

  const toggleVideo = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) { track.enabled = !track.enabled; setIsVideoOn(track.enabled); }
  };

  const executeLeave = async () => {
    window.removeEventListener("beforeunload", onBeforeUnload);

    if (onLeave) {
      try {
        await onLeave(roomId);
      } catch (err) {
        console.error("Error calling leave API:", err);
      }
    }

    // 1. Null out video srcObjects first — this signals the browser to release the camera/mic indicator
    if (localVideo.current) localVideo.current.srcObject = null;
    if (remoteVideo.current) remoteVideo.current.srcObject = null;

    // 2. Stop every media track (kills the camera/mic hardware access)
    localStreamRef.current?.getTracks().forEach((t) => {
      t.stop();
    });
    localStreamRef.current = null;

    // 3. Close WebRTC peer connection
    pcRef.current?.close();
    pcRef.current = null;

    // 4. Notify the other participant and disconnect socket
    socketRef.current?.emit("leave-room", { roomId, userId: role });
    socketRef.current?.disconnect();

    // 5. Hard redirect back to the meeting detail page so user can re-join or end the meeting
    window.location.href = `/${role.toLowerCase()}/meetings/${roomId}`;
  };

  const leaveRoom = () => {
    setShowLeaveModal(true);
  };

  if (!mounted) return null;

  if (connectionState === "duplicate") {
    return createPortal(
      <div className="fixed inset-0 bg-slate-900 z-[9999] flex flex-col items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Already Joined</h3>
          <p className="text-slate-300 mb-8">
            You are already in this meeting from another tab or device. Please close this tab and return to your active session.
          </p>
          <button
            onClick={() => window.location.href = `/${role.toLowerCase()}/meetings/${roomId}`}
            className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 bg-slate-900 z-[9999] flex flex-col items-center justify-center p-4">

      {/* Status Header */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2 drop-shadow-md">
          {connectionState === "connecting" && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
          {connectionState === "waiting"    && <Loader2 className="w-4 h-4 animate-spin text-amber-400" />}
          {connectionState === "connected"  && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
          <span className="text-sm font-semibold tracking-wide">
            {connectionState === "connecting" && "Connecting..."}
            {connectionState === "waiting"    && "Waiting for the other participant to join..."}
            {connectionState === "connected"  && "Connection Established"}
          </span>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="relative w-full max-w-6xl h-[75vh] flex gap-4 mt-16 justify-center px-4 overflow-hidden">

        {/* Remote Video — always in DOM so srcObject persists across re-renders */}
        <div className={`relative bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl transition-all duration-500 flex-1 flex flex-col items-center justify-center ${
          connectionState === "connected" ? "ring-2 ring-emerald-500/30" : ""
        }`}>
          {connectionState !== "connected" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-4 z-10">
              <div className="w-20 h-20 bg-slate-800/60 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 text-slate-500" />
              </div>
              <p className="text-lg font-medium animate-pulse">
                Waiting for {otherName}...
              </p>
            </div>
          )}
          {/* Video is always rendered — opacity controlled so srcObject is never lost */}
          <video
            ref={remoteVideo}
            autoPlay
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              connectionState === "connected" ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Local Video */}
        <div className={`overflow-hidden border-2 shadow-2xl transition-all duration-500 z-20 bg-slate-800 ${
          connectionState === "connected"
            ? "absolute bottom-6 right-6 w-48 h-36 rounded-2xl border-white/20 hover:scale-105 cursor-pointer"
            : "w-72 rounded-3xl border-slate-700 relative"
        }`}>
          <video
            ref={localVideo}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover -scale-x-100"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-semibold text-white">
            {myName} (You)
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-5 bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-3xl shadow-2xl z-50">
        <button onClick={toggleMic} title={isMicOn ? "Mute" : "Unmute"}
          className={`p-4 rounded-2xl transition-all duration-200 shadow-lg ${isMicOn ? "bg-slate-700/80 hover:bg-slate-600 text-white" : "bg-rose-500 hover:bg-rose-600 text-white"}`}>
          {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>

        <button onClick={leaveRoom} title="Leave Room"
          className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all duration-200 shadow-lg shadow-amber-500/20 text-white font-bold flex items-center gap-2">
          <LogOut className="w-6 h-6" />
          <span>Leave Room</span>
        </button>

        <button onClick={toggleVideo} title={isVideoOn ? "Turn off camera" : "Turn on camera"}
          className={`p-4 rounded-2xl transition-all duration-200 shadow-lg ${isVideoOn ? "bg-slate-700/80 hover:bg-slate-600 text-white" : "bg-rose-500 hover:bg-rose-600 text-white"}`}>
          {isVideoOn ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
              <LogOut className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Leave Meeting?</h3>
            <p className="text-slate-300 mb-8">
              Are you sure you want to leave the meeting room? Your camera and microphone will be turned off.
            </p>
            <div className="flex w-full gap-4">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeLeave}
                className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-colors shadow-lg shadow-rose-500/20"
              >
                Yes, Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}