import fs from "fs";
import p from "path";

import { FileData } from "../../typings.js";

const getAllFiles = async (path: string, foldersOnly = false) => {
  const files = fs.readdirSync(path, {
    withFileTypes: true,
  });
  let filesFound: FileData[] = [];

  for (const file of files) {
    const filePath = p.join(path, file.name);

    if (file.isDirectory()) {
      if (foldersOnly) {
        filesFound.push({
          filePath,
          fileContents: file,
        });
      } else {
        filesFound = [...filesFound, ...(await getAllFiles(filePath))];
      }
      continue;
    }
    if (!file.name.endsWith('.js') && !file.name.endsWith('.ts')) continue

    const fileContents = await import(filePath);
    filesFound.push({
      filePath,
      fileContents: fileContents?.default || fileContents,
    });
  }

  return filesFound;
};

export default getAllFiles;
