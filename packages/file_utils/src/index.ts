import * as fs from "fs";

interface File {
  type: "file" | "dir";
  name: string;
}
export const fetchDir = (dir: string, baseDir: string): Promise<File[]> => {
  console.log("fetchDir", dir, baseDir);
  return new Promise((resolve, reject) => {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          files.map((file) => ({
            type: file.isDirectory() ? "dir" : "file",
            name: file.name,
            path: `${baseDir}/${file.name}`,
          }))
        );
      }
    });
  });
};
