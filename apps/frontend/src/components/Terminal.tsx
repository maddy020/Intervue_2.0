import { Socket } from "socket.io-client";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { useEffect, useRef } from "react";
import "./xterm.css";
const fitAddon = new FitAddon();
const OPTIONS_TERM = {
  cursorBlink: true,
  cols: 200,
  theme: {
    background: "#1E1E1E", // Dark background color
    foreground: "#CCCCCC", // Light text color
  },
};
function ab2str(buf: ArrayBuffer) {
  return String.fromCharCode.apply(null, [...new Uint8Array(buf)]);
}

const TerminalComponent = ({ socket }: { socket: Socket | null }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!terminalRef.current || !socket) return;

    const term = new Terminal(OPTIONS_TERM);
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    function handler({ data }: { data: ArrayBuffer }) {
      if (data instanceof ArrayBuffer) {
        term.write(ab2str(data));
      }
    }

    socket.emit("requestTerminal");
    socket.on("terminal", handler);
    socket.on("broadcast", ({ data, id }: { data: string; id: string }) => {
      if (id == socket.id) return;
      term.write(data);
      switch (data) {
        case "\r":
          socket.emit("terminalDataBroadcasted", { data: "\n" });
          break;
        case "\x7F":
          socket.emit("terminalDataBroadcasted", { data: "\b" });
          break;
        case "\x1B[D":
          socket.emit("terminalDataBroadcasted", { data: "\x1B[D" });
          break;
        case "\x1B[C":
          socket.emit("terminalDataBroadcasted", { data: "\x1B[C" });
          break;
        default:
          socket.emit("terminalDataBroadcasted", { data });
          break;
      }
    });
    term.onData((data) => {
      switch (data) {
        case "\r":
          socket.emit("terminalData", { data: "\n" });
          break;
        case "\x7F":
          socket.emit("terminalData", { data: "\b" });
          break;
        case "\x1B[D":
          socket.emit("terminalData", { data: "\x1B[D" });
          break;
        case "\x1B[C":
          socket.emit("terminalData", { data: "\x1B[C" });
          break;
        default:
          socket.emit("terminalData", { data });
          break;
      }
    });

    return () => {
      socket.off("terminal", handler);
      socket.off("broadcast");
      term.dispose();
    };
  }, [terminalRef, socket]);

  return (
    <div
      style={{
        width: "40vw", // Adjust width as needed
        height: "50vh", // Adjust height as needed
        textAlign: "left",
        fontFamily: "monospace",
        fontSize: "30px",
        padding: "10px",
      }}
      ref={terminalRef}
    ></div>
  );
};

export default TerminalComponent;
