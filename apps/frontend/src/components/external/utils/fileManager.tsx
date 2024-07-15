import { FileType, File, RemoteFile, Directory } from "@repo/types";

export function buildTree(data: RemoteFile[]): Directory {
  const dirs = data.filter((item) => item.type === "dir");
  const files = data.filter((item) => item.type === "file");
  const cache = new Map<string, Directory | File>();

  const rootDir: Directory = {
    id: "root",
    name: "root",
    parentId: undefined,
    type: FileType.DIRECTORY,
    path: "",
    depth: 0,
    dirs: [],
    files: [],
  };

  dirs.forEach((item) => {
    const dir: Directory = {
      id: item.path,
      name: item.name,
      path: item.path,
      parentId:
        item.path.split("/").length === 2
          ? "0"
          : dirs.find(
              (x) => x.path === item.path.split("/").slice(0, -1).join("/")
            )?.path,
      type: FileType.DIRECTORY,
      depth: 0,
      dirs: [],
      files: [],
    };
    cache.set(dir.id, dir);
  });

  files.forEach((item) => {
    const file: File = {
      id: item.path,
      name: item.name,
      path: item.path,
      parentId:
        item.path.split("/").length === 2
          ? "0"
          : dirs.find(
              (x) => x.path === item.path.split("/").slice(0, -1).join("/")
            )?.path,
      type: FileType.FILE,
      depth: 0,
    };
    cache.set(file.id, file);
  });

  getDepth(rootDir, 0);
  return rootDir;
}

function getDepth(rootDir: Directory, curDepth: number) {
  rootDir.files.forEach((file) => {
    file.depth = curDepth + 1;
  });
  rootDir.dirs.forEach((dir) => {
    dir.depth = curDepth + 1;
    getDepth(dir, curDepth + 1);
  });
}

export function findFileByName(
  rootDir: Directory,
  filename: string
): File | undefined {
  let targetFile: File | undefined = undefined;

  function findFile(rootDir: Directory, filename: string) {
    rootDir.files.forEach((file) => {
      if (file.name === filename) {
        targetFile = file;
        return;
      }
    });
    rootDir.dirs.forEach((dir) => {
      findFile(dir, filename);
    });
  }

  findFile(rootDir, filename);
  return targetFile;
}

export function sortDir(l: Directory, r: Directory) {
  return l.name.localeCompare(r.name);
}

export function sortFile(l: File, r: File) {
  return l.name.localeCompare(r.name);
}
