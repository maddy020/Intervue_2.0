import { useEffect, useState } from "react";
import Terminal from "./Terminal";
import axios from "axios";
import { Socket, io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import Editor from "./Editor";
import Output from "./Output";
import { FileType, File, RemoteFile } from "@repo/types";

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
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [fileStructure, setFileStructure] = useState<RemoteFile[]>([]);
  useEffect(() => {
    if (socket) {
      socket.on("loaded", ({ rootContent }: { rootContent: RemoteFile[] }) => {
        setLoaded(true);
        setFileStructure(rootContent);
      });
    }
  }, [socket]);
  const onSelect = (file: File) => {
    if (file.type === FileType.DIRECTORY) {
      socket?.emit("fetchDir", file.path, (data: RemoteFile[]) => {
        setFileStructure((prev) => {
          const allFiles = [...prev, ...data];
          return allFiles.filter(
            (file, index, self) =>
              index === self.findIndex((f) => f.path === file.path)
          );
        });
      });
    } else {
      socket?.emit("fetchContent", { path: file.path }, (data: string) => {
        file.content = data;
        setSelectedFile(file);
      });
    }
  };
  if (!loaded) {
    return <div className="bg-slate-600">loading...</div>;
  }
  return (
    <div className="flex text-lg w-full">
      <div className="w-[60%] flex">
        <Editor
          socket={socket}
          onSelect={onSelect}
          selectedFile={selectedFile}
          files={fileStructure}
        />
        <div className="flex flex-col w-[40%]">
          <Output />
          <Terminal socket={socket} />
        </div>
      </div>
    </div>
  );
};
