import fs from "fs-extra";
import path from "path";
import { glob } from "glob";

export interface DeleteResult {
  successFilesCount: number;
  successDirsCount: number;
  errorCount: number;
  deletedPaths: Set<string>;
}

export async function deleteFiles(
  filePatterns: string[],
  recursive = false
): Promise<DeleteResult> {
  const result: DeleteResult = {
    successFilesCount: 0,
    successDirsCount: 0,
    errorCount: 0,
    deletedPaths: new Set<string>(),
  };

  const matchedFiles = filePatterns.flatMap((pattern) =>
    glob.sync(pattern, {
      cwd: process.cwd(),
      nodir: !recursive,
      absolute: true,
    })
  );

  await Promise.all(
    matchedFiles.map(async (fullPath) => {
      if (
        Array.from(result.deletedPaths).some((deletedPath) =>
          fullPath.startsWith(deletedPath + path.sep)
        )
      ) {
        return;
      }

      try {
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory() && recursive) {
          const items = await fs.readdir(fullPath);
          await Promise.all(
            items.map(async (item) => {
              const itemPath = path.join(fullPath, item);
              await deleteFiles([itemPath], true);
            })
          );
          await fs.rmdir(fullPath);
          result.successDirsCount++;
        } else {
          await fs.unlink(fullPath);
          result.successFilesCount++;
        }
        result.deletedPaths.add(fullPath);
      } catch (err) {
        result.errorCount++;
        throw err;
      }
    })
  );

  return result;
}
