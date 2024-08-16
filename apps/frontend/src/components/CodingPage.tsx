import { useEffect, useRef, useState } from "react";
import Terminal from "./Terminal";
import { Socket, io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import Editor from "./Editor";
import Output from "./Output";
import { FileType, File, RemoteFile } from "@repo/types";
import Interview from "./Interview";
import Draggable from "react-draggable";

function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    try {
      const replId = localStorage.getItem("replId");
      const newSocket = io(`ws://${replId}.api.intervue.200xdevs.works`);
      setSocket(newSocket);
      return () => {
        newSocket.disconnect();
      };
    } catch (err) {
      console.log(err);
    }
  }, []);
  return socket;
}

export const CodingPage = () => {
  const isPodCreated = localStorage.getItem("replId") ? true : false;
  const [podCreated, setPodCreated] = useState(isPodCreated);
  const [searchParams] = useSearchParams();
  const replId = searchParams.get("replId") ?? "";
  const token = searchParams.get("token") ?? "";
  console.log(token);
  useEffect(() => {
    if (replId && !podCreated) {
      localStorage.setItem("replId", replId);
      setPodCreated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!podCreated) {
    return <>Booting....</>;
  }
  return <CodingComp token={token} />;
};

export const CodingComp = ({ token }: { token: string }) => {
  const socket = useSocket();
  const [loaded, setLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [fileStructure, setFileStructure] = useState<RemoteFile[]>([]);
  const isDraggingRef = useRef(false);

  const onDrag = () => {
    isDraggingRef.current = true;
  };

  const onStop = () => {
    isDraggingRef.current = false;
  };

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
    <>
      <div className="flex text-lg">
        <div className="flex">
          <Editor
            socket={socket}
            onSelect={onSelect}
            selectedFile={selectedFile}
            files={fileStructure}
          />
          <div className="flex flex-col ">
            <Output />
            <Terminal socket={socket} />
          </div>
        </div>
      </div>

      <Draggable onDrag={onDrag} onStop={onStop}>
        <div className="Piece">
          <span className="Piece-phrase">
            <Interview token={token} />
          </span>
        </div>
      </Draggable>
    </>
  );
};
