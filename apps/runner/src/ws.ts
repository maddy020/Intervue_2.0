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
  });

  socket.on(
    "fetchContent",
    async ({ path: filePath }: { path: string }, callback) => {
      const fullPath = `/workspace/${filePath}`;
      const data = await fetchFileContent(fullPath);
      callback(data);
    }
  );

  socket.on(
    "updateContent",
    async ({ path: filePath, content }: { path: string; content: string }) => {
      try {
        const fullPath = `/workspace/${filePath}`;
        console.log("content received", content);
        await saveFile(fullPath, content);
        await saveToS3(`code/${replId}`, filePath, content);
      } catch (error) {
        console.log(error);
      }
    }
  );
  socket.on(
    "terminalData",
    async ({ data }: { data: string; terminalId: number }) => {
      terminalManager.write(socket.id, data);
    }
  );
}
