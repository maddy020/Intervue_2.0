import { ColumnDef } from "@tanstack/react-table";

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

export type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  clerkId: string;
}

export interface ExtendedUser extends BaseUser {
  meet: Array<JSON>;
  meetParticipants: Array<JSON>;
}

export type Meeting = {
  id: string;
  status: string;
  dateandTime: string;
  participants: Array<{ user: { name: string } }>;
  roomId: string;
};

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
