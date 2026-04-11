"use client";

import VideoCall from "@/app/components/containers/video-call/VideoCal";


export default function ClientVideoCallPage({ params }: any) {
  return <VideoCall roomId={params.roomId} role="CLIENT" />;
}