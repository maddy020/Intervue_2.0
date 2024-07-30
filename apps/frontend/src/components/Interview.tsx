import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

const Interview = ({ token }: { token: string }) => {
  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      connect={true}
      serverUrl={import.meta.env.VITE_NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: "40dvh" }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default Interview;
