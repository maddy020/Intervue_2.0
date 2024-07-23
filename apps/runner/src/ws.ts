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
        await saveFile(fullPath, content);
        await saveToS3(`code/${replId}`, filePath, content);
      } catch (error) {
        console.log(error);
      }
    }
  );

  socket.on("terminalData", async ({ data }: { data: string }) => {
    commandBuffer += data;
    console.log("data received", commandBuffer);
    if (commandBuffer.includes("\x1B[D")) {
      count++;
      console.log("Left Key Pressed");
    } else if (commandBuffer.includes("\x1B[C")) {
      count--;
      if (count < 0) count = 0;
      console.log("Right Key Pressed");
    } else if (commandBuffer.includes("\b")) {
      console.log("inside the backspace");
      const n = commandBuffer.length;
      commandBuffer =
        commandBuffer.slice(0, n - count) + commandBuffer.slice(n - count + 1);
    } else if (commandBuffer.includes("\n")) {
      count = 0;
      const commands = commandBuffer.split("\n");
      commandBuffer = commands.pop() || ""; // Retain any incomplete command

      for (let command of commands) {
        command = command.trim();
        console.log("Received command:", command);

        if (command.startsWith("mkdir")) {
          console.log("Processing mkdir command:", command);
          // Add mkdir logic here
        } else if (command.startsWith("touch")) {
          console.log("Processing touch command:", command);
          // Add touch logic here
        }
      }
    }

    terminalManager.write(socket.id, data);
  });
}
