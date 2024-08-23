import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import axios from "axios";
import { useRef } from "react";

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
  const timeOutRef = useRef<number | null>(null);

  const handleDisconnected = () => {
    const ans = prompt("Are you sure you want to leave the meeting?");
    if (ans == "No") return;
    return removeMeeting();
  };

  const removeMeeting = () => {
    if (role === import.meta.env.VITE_INTERVIEWER) {
      timeOutRef.current = window.setTimeout(async () => {
        localStorage.removeItem("replId");
        try {
          const res = await axios.post("http://localhost:8000/EndMeeting", {
            replId: replId,
          });
          console.log(res);
        } catch (error) {
          console.log(
            "Error while deleting services like deployment, service, ingress",
            error
          );
        }
      }, 60000);

      window.location.href = `http://localhost:3000/dashboard/interviewer/${id}`;
    } else if (role === import.meta.env.VITE_INTERVIEWEE) {
      localStorage.removeItem("replId");
      window.location.href = `http://localhost:3000/dashboard/interviewer/${id}`;
    }
  };

  const handleRejoin = () => {
    if (role === import.meta.env.VITE_INTERVIEWER) {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
        timeOutRef.current = null;
      }
    }
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
      onDisconnected={handleDisconnected}
      onConnected={handleRejoin}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default Interview;
