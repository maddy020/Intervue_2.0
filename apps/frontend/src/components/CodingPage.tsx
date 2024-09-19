import { useEffect, useRef, useState } from "react";
import Terminal from "./Terminal";
import { Socket, io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import Editor from "./Editor";
import { RemoteFile } from "@repo/types";
import Interview from "./Interview";
import Draggable from "react-draggable";
import axios from "axios";
import { Output } from "./Output";

enum FileType {
  FILE,
  DIRECTORY,
  DUMMY,
}

interface CommonProps {
  id: string;
  name: string;
  type: FileType;
  depth: number;
  content?: string;
  path: string;
  parentId: string | undefined;
}

interface File extends CommonProps {}

function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    try {
      const replId = localStorage.getItem("replId");
      const newSocket = io(`wss://${replId}.interview.rishavrtwt.tech`);
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
  const role = searchParams.get("role") ?? "";
  const id = searchParams.get("id") ?? "";
  const [isValidUser, setIsValidUser] = useState(false);

  useEffect(() => {
    const ValidateUser = async () => {
      try {
        const res = await axios.post(
          `https://syncin.initservice.200xdevs.works/validUser/${id}`,
          {
            replId: replId,
          }
        );
        console.log(res.data);
        setIsValidUser(res.data.status);
      } catch (error) {
        console.log("Error while validating user", error);
      }
    };
    ValidateUser();
  }, [id, replId]);

  if (!isValidUser) {
    return <div>You are not allowed to join this meeting</div>;
  }

  async function solve() {
    try {
      const res1 = await axios.get(
        `https://syncin.initservice.200xdevs.works/getToken?replId=${replId}&username=${username}`
      );

      setToken(res1.data.token);
    } catch (error) {
      console.log("Error while fetching token", error);
    }
  }

  if (isValidUser) {
    if (replId && !podCreated) {
      localStorage.setItem("replId", replId);
      setPodCreated(true);
    }
    solve();
    return <CodingComp token={token} role={role} id={id} replId={replId} />;
  }

  if (!podCreated) {
    return (
      <>
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="flex justify-center mt-10 text-xl">
          Please wait, we are setting up the environment
        </div>
      </>
    );
  }
};

export const CodingComp = ({
  token,
  role,
  id,
  replId,
}: {
  token: string;
  role: string;
  id: string;
  replId: string;
}) => {
  const socket = useSocket();
  const [loaded, setLoaded] = useState(false);
  const [currentFile, setCurrentFile] = useState<File>();
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [fileStructure, setFileStructure] = useState<RemoteFile[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [showOutput, setShowOutput] = useState<boolean>(false);
  const isDraggingRef = useRef(false);

  const onDrag = () => {
    isDraggingRef.current = true;
  };

  const onStop = () => {
    isDraggingRef.current = false;
  };

  const toggleSize = (data: boolean) => {
    setIsFullScreen(!isFullScreen);
    socket?.emit("CreateRepl", data);
  };

  useEffect(() => {
    if (socket) {
      socket.on("loaded", ({ rootContent }: { rootContent: RemoteFile[] }) => {
        setLoaded(true);
        setFileStructure(rootContent);
      });

      socket.on("Repl Created", (data: boolean) => {
        console.log("Repl Created", data);
        setIsFullScreen(!data);
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
      console.log("fetchContent", currentFile);
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
    return (
      <>
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="flex justify-center mt-10 text-xl">
          Hold tight, we are ready to kick off the meeting
        </div>
      </>
    );
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
            <div className="text-gray-400 ml-2">Output</div>
            <div className="flex flex-col gap-1 pl-2">
              <div className="flex gap-4 items-center">
                <button
                  className="hover:underline font-semibold"
                  onClick={() => setShowOutput(!showOutput)}
                >
                  {showOutput ? "Hide" : "Show"} Output
                </button>

                <a
                  target="_blank"
                  href={`http://${replId}.output.rishavrtwt.tech`}
                  className="flex items-center justify-center rounded-md p-2 hover:bg-slate-200 hover:text-black"
                >
                  <span className="material-symbols-outlined">open_in_new</span>
                </a>
              </div>
              {showOutput && <Output />}
              <span className="text-gray-400">Terminal</span>
              <Terminal socket={socket} />
            </div>
          </div>
        </div>
      </div>

      {role === import.meta.env.VITE_INTERVIEWER &&
        (isFullScreen ? (
          <button
            onClick={() => toggleSize(true)}
            className="absolute z-50 top-2 right-2 bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Create Repl
          </button>
        ) : (
          <button
            onClick={() => toggleSize(false)}
            className="absolute z-20 top-2 right-2 bg-red-500 text-white py-2 px-4 rounded-md"
          >
            Close Repl
          </button>
        ))}

      {isFullScreen === false ? (
        <Draggable
          onDrag={onDrag}
          onStop={onStop}
          defaultPosition={{
            x: 290,
            y: -240,
          }}
        >
          <div className="Piece">
            <span className="Piece-phrase">
              <Interview
                token={token}
                className={"h-[42dvh] w-[38dvw]"}
                id={id}
                replId={replId}
                role={role}
              />
            </span>
          </div>
        </Draggable>
      ) : (
        <div className="absolute top-0 z-40">
          <Interview
            token={token}
            className={"h-screen w-screen"}
            id={id}
            replId={replId}
            role={role}
          />
        </div>
      )}
    </>
  );
};
