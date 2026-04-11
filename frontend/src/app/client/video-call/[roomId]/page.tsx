"use client";

import { use } from "react";
import VideoCall from "@/app/components/containers/video-call/VideoCall";

export default function ClientVideoCallPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  return <VideoCall roomId={roomId} role="CLIENT" />;
}