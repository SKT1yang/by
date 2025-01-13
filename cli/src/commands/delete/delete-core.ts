import fs from "fs-extra";
import path from "path";
import { glob } from "glob";
import { DeleteUI } from "./delete-ui";

// 删除操作配置
const DELETE_CONFIG = {
  globOptions: {
    cwd: process.cwd(),
    absolute: true
  },
  errorMessages: {
    directoryWithoutRecursive: "Directory found. Use -r to delete directories."
  }
};

// 类型别名
type DeleteItem = (fullPath: string, result: DeleteResult, options: DeleteOptions, ui: DeleteUI) => Promise<void>;

/**
 * 删除操作结果类型
 */
export interface DeleteResult {
  successFilesCount: number;
  successDirsCount: number;
  errorCount: number;
  deletedPaths: Set<string>;
}

/**
 * 删除操作配置选项
 */
export interface DeleteOptions {
  /** 是否递归删除目录 */
  recursive?: boolean;
  /** 是否输出删除日志 */
  log?: boolean;
}

/**
 * 删除单个文件或目录
 * @param fullPath 要删除的完整路径
 * @param result 删除结果对象
 * @param options 删除配置
 * @param ui UI实例
 */
async function deleteItem(
  fullPath: string,
  result: DeleteResult,
  options: DeleteOptions,
  ui: DeleteUI
) {
  if (result.deletedPaths.has(fullPath)) return;

  try {
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      if (options.recursive) {
        // 递归删除目录内容
        const items = await fs.readdir(fullPath);
        await Promise.all(
          items.map((item) => deleteItem(path.join(fullPath, item), result, options, ui))
        );
        await fs.rmdir(fullPath);
        result.successDirsCount++;
        if (options.log) {
          ui.showDeletedItem(fullPath, true);
        }
      } else {
        throw new Error(DELETE_CONFIG.errorMessages.directoryWithoutRecursive);
      }
    } else {
      await fs.unlink(fullPath);
      result.successFilesCount++;
      if (options.log) {
        ui.showDeletedItem(fullPath, false);
      }
    }
    result.deletedPaths.add(fullPath);
  } catch (err) {
    result.errorCount++;
    throw err;
  }
}

/**
 * 删除匹配指定模式的文件和目录
 * @param filePatterns 文件匹配模式数组
 * @param options 删除配置选项
 * @param ui UI实例
 * @returns 删除结果
 */
export async function deleteFiles(
  filePatterns: string[],
  options: DeleteOptions = { recursive: false, log: false },
  ui: DeleteUI = new DeleteUI()
): Promise<DeleteResult> {
  const result: DeleteResult = {
    successFilesCount: 0,
    successDirsCount: 0,
    errorCount: 0,
    deletedPaths: new Set<string>(),
  };

  const matchedFiles = filePatterns.flatMap((pattern) =>
    glob.sync(pattern, {
      ...DELETE_CONFIG.globOptions,
      nodir: !options.recursive
    })
  );

  await Promise.all(
    matchedFiles.map((file) => deleteItem(file, result, options, ui))
  );

  return result;
}
