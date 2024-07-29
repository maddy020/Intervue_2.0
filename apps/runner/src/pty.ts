import { spawn, IPty } from "node-pty";
import * as os from "os";

const SHELL = os.platform() === "win32" ? "powershell.exe" : "bash";

export class TerminalManager {
  private sessions: { [id: string]: { terminal: IPty; replId: string } } = {};

  constructor() {
    this.sessions = {};
  }

  createPty(
    id: string,
    replId: string,
    onData: (data: string, id: number) => void
  ) {
    const term = spawn(SHELL, [], {
      cols: 200,
      name: "xterm",
      cwd: `/workspace`,
    });

    term.onData((data: string) => onData(data, term.pid));
    this.sessions[id] = {
      terminal: term,
      replId,
    };

    term.onExit(() => {
      delete this.sessions[id];
    });

    return term;
  }

  write(terminalId: string, data: string) {
    this.sessions[terminalId]?.terminal.write(data);
  }

  clear(terminalId: string) {
    this.sessions[terminalId]?.terminal.kill();
    delete this.sessions[terminalId];
  }
}
