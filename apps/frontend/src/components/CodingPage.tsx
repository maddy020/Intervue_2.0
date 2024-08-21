import { useEffect, useRef, useState } from "react";
import Terminal from "./Terminal";
import { Socket, io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import Editor from "./Editor";
import { FileType, File, RemoteFile } from "@repo/types";
import Interview from "./Interview";
import Draggable from "react-draggable";
import axios from "axios";

function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    try {
      const replId = localStorage.getItem("replId");
      const newSocket = io(`ws://${replId}.interview.rishavrtwt.tech`);
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
  const [token, setToken] = useState("");
  const [searchParams] = useSearchParams();
  const replId = searchParams.get("replId") ?? "";
  const username = searchParams.get("username") ?? "";
  console.log(token);
  useEffect(() => {
    async function solve() {
      try {
        const res1 = await axios.get(
          `http://localhost:8000/getToken?replId=${replId}&username=${username}`
        );

        setToken(res1.data.token);
      } catch (error) {
        console.log("Error while fetching token", error);
      }
    }
    solve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replId]);

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
  const [currentFile, setCurrentFile] = useState<File>();
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [fileStructure, setFileStructure] = useState<RemoteFile[]>([]);
  const [isDraggable, setIsDraggable] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const isDraggingRef = useRef(false);

  const onDrag = () => {
    isDraggingRef.current = true;
  };

  const onStop = () => {
    isDraggingRef.current = false;
  };

  const toggleSize = () => {
    setIsFullScreen(!isFullScreen);
    setIsDraggable(!isDraggable);
  };

  useEffect(() => {
    if (socket) {
      socket.on("loaded", ({ rootContent }: { rootContent: RemoteFile[] }) => {
        setLoaded(true);
        setFileStructure(rootContent);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket?.on(
        "fetchDirBroadcaste",
        ({ data, id }: { data: RemoteFile[]; id: string }) => {
          console.log("socketid", id);
          setFileStructure((prev) => {
            const allFiles = [...prev, ...data];
            return allFiles.filter(
              (file, index, self) =>
                index === self.findIndex((f) => f.path === file.path)
            );
          });
        }
      );

      socket?.on(
        "fetchContentBroadcaste",
        ({ data, file }: { data: string; file: File }) => {
          console.log("fetchContentBroadcaste", data);
          console.log("fetchContentBroadcasteFile", file);
          file.content = data;
          setSelectedFile(file);
        }
      );
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
      setCurrentFile(file);
      socket?.emit(
        "fetchContent",
        { path: file.path, file: file },
        (data: string) => {
          file.content = data;
          setSelectedFile(file);
        }
      );
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
          <div className="mt-6">
            <div className="ml-3 text-gray-400">Output</div>
            <Terminal socket={socket} />
          </div>
        </div>
      </div>

      {isFullScreen ? (
        <button
          onClick={toggleSize}
          className="absolute z-50 top-2 right-2 bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Create Repl
        </button>
      ) : (
        <button
          onClick={toggleSize}
          className="absolute z-20 top-2 right-2 bg-red-500 text-white py-2 px-4 rounded-md"
        >
          Close Repl
        </button>
      )}

      {isDraggable ? (
        <Draggable
          onDrag={onDrag}
          onStop={onStop}
          defaultPosition={{
            x: 1470,
            y: -250,
          }}
        >
          <div className="Piece">
            <span className="Piece-phrase">
              <Interview token={token} className={"h-[42dvh] w-[38dvw]"} />
            </span>
          </div>
        </Draggable>
      ) : (
        <div className="absolute top-0 z-40">
          <Interview token={token} className={"h-screen w-screen"} />
        </div>
      )}
    </>
  );
};
