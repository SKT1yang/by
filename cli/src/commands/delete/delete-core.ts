import fs from "fs-extra";
import path from "path";
import { glob } from "glob";

export interface DeleteResult {
  successFilesCount: number;
  successDirsCount: number;
  errorCount: number;
  deletedPaths: Set<string>;
}

export interface DeleteOptions {
  recursive?: boolean;
  log?: boolean;
}

export async function deleteFiles(
  filePatterns: string[],
  { recursive = false, log = false }: DeleteOptions = {}
): Promise<DeleteResult> {
  const result: DeleteResult = {
    successFilesCount: 0,
    successDirsCount: 0,
    errorCount: 0,
    deletedPaths: new Set<string>(),
  };

  async function deleteItem(fullPath: string) {
    if (result.deletedPaths.has(fullPath)) return;

    try {
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        if (recursive) {
          const items = await fs.readdir(fullPath);
          await Promise.all(
            items.map((item) => deleteItem(path.join(fullPath, item)))
          );
          await fs.rmdir(fullPath);
          result.successDirsCount++;
        } else {
          throw new Error("Directory found. Use -r to delete directories.");
        }
      } else {
        await fs.unlink(fullPath);
        result.successFilesCount++;
      }
      result.deletedPaths.add(fullPath);
    } catch (err) {
      result.errorCount++;
      throw err;
    }
  }

  const matchedFiles = filePatterns.flatMap((pattern) =>
    glob.sync(pattern, {
      cwd: process.cwd(),
      nodir: !recursive,
      absolute: true,
    })
  );

  await Promise.all(matchedFiles.map(deleteItem));

  return result;
}
