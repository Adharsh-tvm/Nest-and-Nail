import { getClientMeetingByIdAction, joinMeetingAction, leaveMeetingAction } from "@/app/actions/client/meeting-actions";
import VideoCall from "@/app/components/containers/video-call/VideoCall";

import { ServiceResponseDTO } from "@/shared/types/serviceTypes";

export default async function ClientVideoCallPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const res = await getClientMeetingByIdAction(roomId);
  const clientName = (res.data as ServiceResponseDTO & { client?: { name?: string } })?.client?.name || "Client";
  const workerName = (res.data as ServiceResponseDTO & { worker?: { name?: string } })?.worker?.name || "Worker";

  return <VideoCall 
    roomId={roomId} 
    role="CLIENT" 
    workerName={workerName} 
    clientName={clientName} 
    onJoin={joinMeetingAction}
    onLeave={leaveMeetingAction}
  />;
}