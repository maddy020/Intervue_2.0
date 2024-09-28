import { Socket } from "socket.io-client";
import { Editor } from "@monaco-editor/react";
import { File } from "@repo/types";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { editor } from "monaco-editor";
import { useRef } from "react";

const Code = ({
  socket,
  selectedFile,
}: {
  socket: Socket | null;
  selectedFile: File | undefined;
}) => {
  const code = selectedFile?.content;
  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  let language = selectedFile?.name.split(".").pop();
  if (language == "js" || language == "jsx") {
    language = "javascript";
  } else if (language == "ts" || language == "tsx") {
    language = "typescript";
  } else if (language == "py") {
    language = "python";
  }

  function debounce(func: (value: string) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(value);
      }, wait);
    };
  }

  const handleChange = (
    value: string | undefined,
    event: editor.IModelContentChangedEvent
  ) => {
    console.log("value", value);
    console.log("event", event);
    console.log("selectedFile", selectedFile?.path);
    if (value !== undefined) {
      debounce((value) => {
        socket?.emit("updateContent", {
          path: selectedFile?.path,
          content: value,
        });
      }, 500)(value);
    }
  };

  const handleMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    const doc = new Y.Doc();

    const provider: WebsocketProvider = new WebsocketProvider(
      "wss://syncin.liveshare.200xdevs.works",
      "my-roomname",
      doc
    );
    const type = doc.getText("monaco");

    const binding = new MonacoBinding(
      type,
      editorRef.current!.getModel()!,
      new Set([editorRef.current!])
    );

    console.log(binding, provider);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ height: "95vh", position: "relative" }}>
          <Editor
            width="45.5vw"
            height="100%"
            language={language}
            theme="vs-dark"
            loading={"Loading..."}
            value={code}
            onChange={handleChange}
            className="py-1"
            onMount={handleMount}
          />
        </div>
      </div>
    </>
  );
};

export default Code;
