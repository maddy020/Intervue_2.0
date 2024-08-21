import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

const Interview = ({
  token,
  className,
}: {
  token: string;
  className?: string;
}) => {
  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      connect={true}
      serverUrl={import.meta.env.VITE_NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      className={className || ""}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default Interview;
