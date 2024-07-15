import { Socket } from "socket.io-client";
import { Editor } from "@monaco-editor/react";
const Code = ({ socket }: { socket: Socket | null }) => {
  return (
    <>
      <Editor
        height="100vh"
        language="javascript"
        theme="vs-dark"
        loading={"Loading..."}
        value={"// Welcome to the editor"}
        onChange={(value) => {
          if (socket) {
            console.log(value);
          }
        }}
      />
    </>
  );
};

export default Code;
