import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import axios from "axios";

const Interview = ({
  token,
  className,
  replId,
  role,
}: {
  token: string;
  className?: string;
  replId: string;
  role: string;
}) => {
  const removeMeeting = async () => {
    localStorage.removeItem("replId");
    if (role === import.meta.env.VITE_INTERVIEWER) {
      try {
        const res = await axios.post(
          `https://syncin.initservice.200xdevs.works/EndMeeting`,
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
    window.location.href = `${import.meta.env.VITE_LANDING_URL}/dashboard/interviewer/`;
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
