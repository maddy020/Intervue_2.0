import { Socket } from "socket.io-client";
import Code from "./external/editor/Code";

const Editor = ({ socket }: { socket: Socket | null }) => {
  return (
    <div>
      <div>
        <Code socket={socket} />
      </div>
    </div>
  );
};

export default Editor;
