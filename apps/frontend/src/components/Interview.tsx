import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import axios from "axios";

const Interview = ({
  token,
  className,
  id,
  replId,
  role,
}: {
  token: string;
  className?: string;
  id: string;
  replId: string;
  role: string;
}) => {
  const removeMeeting = async () => {
    localStorage.removeItem("replId");
    if (role === import.meta.env.VITE_INTERVIEWER) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/EndMeeting`,
          {
            replId: replId,
          }
        );
        console.log(res);
      } catch (error) {
        console.log(
          "Error while deleting services like deployment, service, ingress",
          error
        );
      }
    }
    window.location.href = `http://localhost:3000/dashboard/interviewer/${id}`;
  };

  return (
    <LiveKitRoom
      video={false}
      audio={false}
      token={token}
      connect={true}
      serverUrl={import.meta.env.VITE_NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      className={className || ""}
      onDisconnected={removeMeeting}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default Interview;
