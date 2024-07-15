import { useEffect, useState } from "react";
import Terminal from "./Terminal";
import axios from "axios";
import { Socket, io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import Editor from "./Editor";
import { RemoteFile } from "@repo/types";

function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const newSocket = io("ws://212.2.247.138:30080");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);
  return socket;
}

export const CodingPage = () => {
  const isPodCreated = localStorage.getItem("replId") ? true : false;
  const [podCreated, setPodCreated] = useState(isPodCreated);
  const [searchParams] = useSearchParams();
  const replId = searchParams.get("replId") ?? "";
  useEffect(() => {
    if (replId && !isPodCreated) {
      axios
        .post("http://localhost:3002/start", { replId: replId })
        .then(() => {
          localStorage.setItem("replId", replId);
          setPodCreated(true);
        })
        .catch((err) => console.log(err));
    }
  });
  if (!podCreated) {
    return <>Booting....</>;
  }
  return <CodingComp />;
};

export const CodingComp = () => {
  const socket = useSocket();
  const [loaded, setLoaded] = useState(false);
  const [fileStructure, setFileStructure] = useState<RemoteFile[]>([]);
  useEffect(() => {
    if (socket) {
      socket.on("loaded", ({ rootContent }: { rootContent: RemoteFile[] }) => {
        setLoaded(true);
        console.log("code ki maa ka bhosda");
        console.log(rootContent);
        setFileStructure(rootContent);
      });
    }
  }, [socket]);
  return (
    <>
      <div>
        <Editor socket={socket} />
        <Terminal socket={socket} />
      </div>
    </>
  );
};
