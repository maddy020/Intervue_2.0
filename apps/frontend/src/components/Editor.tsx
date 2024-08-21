import { Socket } from "socket.io-client";
import Code from "./external/editor/Code";
import { RemoteFile, File } from "@repo/types";
import { buildTree } from "./external/utils/fileManager";
import Sidebar from "./external/comp/Sidebar";
import { FileTree } from "./external/comp/FileTree";
import { useEffect, useMemo } from "react";
const Editor = ({
  socket,
  onSelect,
  files,
  selectedFile,
}: {
  socket: Socket | null;
  onSelect: (file: File) => void;
  files: RemoteFile[];
  selectedFile: File | undefined;
}) => {
  const rootDir = useMemo(() => {
    return buildTree(files);
  }, [files]);

  useEffect(() => {
    if (!selectedFile) {
      onSelect(rootDir.files[0]);
    }
  }, [onSelect, rootDir.files, selectedFile]);
  return (
    <div className="flex">
      <Sidebar>
        <FileTree
          rootDir={rootDir}
          selectedFile={selectedFile}
          onSelect={onSelect}
        />
      </Sidebar>
      <div className="mt-3">
        <div className="border-b-2 border-b-gray-400">
          <span className="text-base text-gray-400">{selectedFile?.name}</span>
        </div>
        <Code socket={socket} selectedFile={selectedFile} />
      </div>
    </div>
  );
};

export default Editor;
