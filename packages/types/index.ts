export enum FileType {
  File,
  Directory,
  Dummy,
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
