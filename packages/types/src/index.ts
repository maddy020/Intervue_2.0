export enum FileType {
  FILE,
  DIRECTORY,
  DUMMY,
}

export interface CommonProps {
  id: string;
  name: string;
  type: FileType;
  depth: number;
  content?: string;
  path: string;
  parentId: string | undefined;
}

export interface File extends CommonProps {}

export interface RemoteFile {
  type: "file" | "dir";
  name: string;
  path: string;
}

export interface Directory extends CommonProps {
  dirs: Directory[];
  files: File[];
}

export interface FileTreeProps {
  rootDir: Directory;
  selectedFile: File | undefined;
  onSelect: (file: File) => void;
}

export interface SubTreeProps {
  directory: Directory;
  selectedFile: File | undefined;
  onSelect: (file: File) => void;
}
