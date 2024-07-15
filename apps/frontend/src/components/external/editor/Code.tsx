import { Socket } from "socket.io-client";
import { Editor, OnChange } from "@monaco-editor/react";
import { File } from "@repo/types";
const Code = ({
  socket,
  selectedFile,
}: {
  socket: Socket | null;
  selectedFile: File | undefined;
}) => {
  const code = selectedFile?.content;
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
  const handleChange: OnChange = (value) => {
    if (value !== undefined) {
      debounce((value) => {
        socket?.emit("updateContent", {
          path: selectedFile?.path,
          content: value,
        });
      }, 500)(value);
    }
  };

  return (
    <>
      <Editor
        height="100vh"
        language={language}
        theme="vs-dark"
        loading={"Loading..."}
        value={code}
        onChange={handleChange}
      />
    </>
  );
};

export default Code;
