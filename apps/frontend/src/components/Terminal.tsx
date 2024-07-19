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

    term.onData((data) => {
      socket.emit("terminalData", { data });
    });

    return () => {
      socket.off("terminal", handler);
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
