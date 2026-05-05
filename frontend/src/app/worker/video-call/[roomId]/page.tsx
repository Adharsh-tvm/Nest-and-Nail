import { getWorkerMeetingByIdAction, joinMeetingAction, leaveMeetingAction } from "@/app/actions/worker/meeting-actions";
import VideoCall from "@/app/components/containers/video-call/VideoCall";

export default async function WorkerVideoCallPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const res = await getWorkerMeetingByIdAction(roomId);
  const clientName = (res.data as any)?.client?.name || "Client";
  const workerName = (res.data as any)?.worker?.name || "Worker";

  return <VideoCall 
    roomId={roomId} 
    role="WORKER" 
    workerName={workerName} 
    clientName={clientName} 
    onJoin={joinMeetingAction}
    onLeave={leaveMeetingAction}
  />;
}