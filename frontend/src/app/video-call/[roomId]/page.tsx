"use client";

import { useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function VideoCallPage({ params }: any) {
  const { roomId } = params;

  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const pc = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideo.current) {
        localVideo.current.srcObject = stream;
      }

      pc.current = new RTCPeerConnection();

      stream.getTracks().forEach((track) => {
        pc.current!.addTrack(track, stream);
      });

      pc.current.ontrack = (event) => {
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = event.streams[0];
        }
      };

      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            roomId,
            candidate: event.candidate,
          });
        }
      };

      socket.emit("join-room", { roomId, userId: "user1" });

      socket.on("initiate-call", async ({ isInitiator }) => {
        if (isInitiator) {
          const offer = await pc.current!.createOffer();
          await pc.current!.setLocalDescription(offer);

          socket.emit("offer", { roomId, offer });
        }
      });

      socket.on("offer", async (offer) => {
        await pc.current!.setRemoteDescription(offer);

        const answer = await pc.current!.createAnswer();
        await pc.current!.setLocalDescription(answer);

        socket.emit("answer", { roomId, answer });
      });

      socket.on("answer", async (answer) => {
        await pc.current!.setRemoteDescription(answer);
      });

      socket.on("ice-candidate", async (candidate) => {
        await pc.current!.addIceCandidate(candidate);
      });

      socket.on("user-left", () => {
        alert("User left call");
      });
    };

    start();
  }, []);

  const endCall = () => {
    const stream = localVideo.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((t) => t.stop());

    socket.emit("leave-room", { roomId, userId: "user1" });
  };

  return (
    <div>
      <h1>Video Call</h1>

      <video ref={localVideo} autoPlay muted />
      <video ref={remoteVideo} autoPlay />

      <button onClick={endCall}>End Call</button>
    </div>
  );
}