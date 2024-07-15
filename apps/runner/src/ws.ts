import { Server, Socket } from "socket.io";
import { TerminalManager } from "./pty";
import { fetchDir } from "@repo/file_utils";

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

  socket.on(
    "terminalData",
    async ({ data }: { data: string; terminalId: number }) => {
      terminalManager.write(socket.id, data);
    }
  );
}
