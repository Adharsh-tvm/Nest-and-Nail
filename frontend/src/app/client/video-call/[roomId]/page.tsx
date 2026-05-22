import { getClientMeetingByIdAction, joinMeetingAction, leaveMeetingAction } from "@/app/actions/client/meeting-actions";
import VideoCall from "@/app/components/containers/video-call/VideoCall";
import { redirect } from "next/navigation";
import { ServiceResponseDTO } from "@/shared/types/serviceTypes";

export const dynamic = "force-dynamic";

export default async function ClientVideoCallPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const res = await getClientMeetingByIdAction(roomId);

  if (!res.success || !res.data) {
    redirect("/client/meetings");
  }

  const meeting = res.data;

  // If the meeting is completed, cancelled, expired, or ended
  const isEnded = 
    ["COMPLETED", "CANCELLED", "CANCELLED_BY_CLIENT", "CANCELLED_BY_WORKER", "EXPIRED", "NO_SHOW", "WORKER_ABSENT", "CLIENT_ABSENT"].includes(meeting.status) ||
    meeting.videoCall?.status === "ENDED" ||
    meeting.videoCall?.endedAt;

  if (isEnded) {
    redirect(`/client/meetings/${roomId}`);
  }

  const clientName = (meeting as ServiceResponseDTO & { client?: { name?: string } })?.client?.name || "Client";
  const workerName = (meeting as ServiceResponseDTO & { worker?: { name?: string } })?.worker?.name || "Worker";

  return <VideoCall 
    roomId={roomId} 
    role="CLIENT" 
    workerName={workerName} 
    clientName={clientName} 
    onJoin={joinMeetingAction}
    onLeave={leaveMeetingAction}
  />;
}