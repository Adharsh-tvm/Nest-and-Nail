import { getClientMeetingByIdAction } from "@/app/actions/client/meeting-actions";
import VideoCall from "@/app/components/containers/video-call/VideoCall";

export default async function ClientVideoCallPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const res = await getClientMeetingByIdAction(roomId);
  const clientName = (res.data as any)?.client?.name || "Client";
  const workerName = (res.data as any)?.worker?.name || "Worker";

  return <VideoCall roomId={roomId} role="CLIENT" workerName={workerName} clientName={clientName} />;
}