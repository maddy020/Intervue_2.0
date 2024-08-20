import { Server, Socket } from "socket.io";
import { TerminalManager } from "./pty";
import { saveToS3 } from "./aws";
import { fetchDir, saveFile, fetchFileContent } from "./file";

export async function initWs(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    const host = socket.handshake.headers.host;
    const replId = host?.split(".")[0];
    if (!replId) {
      socket.disconnect();
      return;
    }
    socket.emit("loaded", {
      rootContent: await fetchDir("/workspace", ""),
    });
    initHandler(socket, replId);
  });
}

async function initHandler(socket: Socket, replId: string) {
  const terminalManager = new TerminalManager();
  let commandBuffer = "";
  let count = 0;
  socket.on("requestTerminal", async () => {
    terminalManager.createPty(socket.id, replId, (data, id) => {
      socket.emit("terminal", {
        data: Buffer.from(data, "utf-8"),
      });
    });
  });

  socket.on("fetchDir", async (dir: string, callback) => {
    const dirPath = `/workspace/${dir}`;
    const contents = await fetchDir(dirPath, dir);
    callback(contents);
    socket.broadcast.emit("fetchDirBroadcaste", {
      data: contents,
      id: socket.id,
    });
  });

  socket.on(
    "fetchContent",
    async (
      { path: filePath, file }: { path: string; file: File },
      callback
    ) => {
      const fullPath = `/workspace/${filePath}`;
      const data = await fetchFileContent(fullPath);
      console.log("file in runner", file);
      socket.broadcast.emit("fetchContentBroadcaste", {
        data: data,
        id: socket.id,
        file: file,
      });
      callback(data);
    }
  );

  socket.on(
    "updateContent",
    async ({ path: filePath, content }: { path: string; content: string }) => {
      try {
        const fullPath = `/workspace/${filePath}`;
        await saveFile(fullPath, content);
        await saveToS3(`code/${replId}`, filePath, content);
      } catch (error) {
        console.log(error);
      }
    }
  );
  socket.on("terminalDataBroadcasted", async ({ data }: { data: string }) => {
    console.log("data received in broadcast", data);
    terminalManager.write(socket.id, data);
  });

  socket.on("terminalData", async ({ data }: { data: string }) => {
    console.log("data received not in broadcast", data);
    terminalManager.write(socket.id, data);
    socket.broadcast.emit("broadcast", { data: data, id: socket.id });
  });
}
