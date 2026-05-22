import { getWorkerMeetingByIdAction, joinMeetingAction, leaveMeetingAction } from "@/app/actions/worker/meeting-actions";
import VideoCall from "@/app/components/containers/video-call/VideoCall";
import { redirect } from "next/navigation";
import { ServiceResponseDTO } from "@/shared/types/serviceTypes";

export const dynamic = "force-dynamic";

export default async function WorkerVideoCallPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const res = await getWorkerMeetingByIdAction(roomId);
  const clientName = (res.data as ServiceResponseDTO & { client?: { name?: string } })?.client?.name || "Client";
  const workerName = (res.data as ServiceResponseDTO & { worker?: { name?: string } })?.worker?.name || "Worker";

  return <VideoCall 
    roomId={roomId} 
    role="WORKER" 
    workerName={workerName} 
    clientName={clientName} 
    onJoin={joinMeetingAction}
    onLeave={leaveMeetingAction}
  />;
}