import fs from "fs-extra";
import path from "path";
import { glob } from "glob";
import { ui } from "./delete-ui";
import { DELETE_CONFIG } from "./constants";

/**
 * 删除操作核心模块
 * 提供文件/目录删除、匹配等核心功能
 */

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
  /** 是否删除默认配置的文件 */
  isDefaultMode?: boolean;
}

/**
 * 删除单个文件或目录
 * @param fullPath 要删除的完整路径
 * @param result 删除结果对象
 * @param options 删除配置
 */
async function deleteItem(
  fullPath: string,
  result: DeleteResult,
  options: DeleteOptions
) {
  // 判断是否存在
  if (!fs.existsSync(fullPath)) {
    ui.showDeletedItem(fullPath, "notExist");
    return;
  }
  if (result.deletedPaths.has(fullPath)) return;

  try {
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true });
      result.successDirsCount++;
      result.deletedPaths.add(fullPath);
      if (options.log) {
        ui.showDeletedItem(fullPath, "directory");
      }
    }
    if (stat.isFile()) {
      await fs.unlink(fullPath);
      result.successFilesCount++;
      result.deletedPaths.add(fullPath);
      if (options.log) {
        ui.showDeletedItem(fullPath, "file");
      }
    }
  } catch (err) {
    result.errorCount++;
    throw err;
  }
}

/**
 * 匹配文件
 * @param patterns 匹配模式数组，可以是glob模式、文件名或路径
 * @param options 匹配配置选项
 * @returns 匹配到的文件路径数组
 */
export function matchFiles(
  patterns: string[],
  options: DeleteOptions
): string[] {
  if (options.isDefaultMode) return DELETE_CONFIG.default.files;
  const nestedFilePathList = patterns.map((pattern) => {
    // 如果是绝对路径或相对路径
    if (path.isAbsolute(pattern) || pattern.startsWith(".")) {
      return path.resolve(pattern);
    }
    // 如果是文件名
    if (!pattern.includes("*") && !pattern.includes("?")) {
      return glob.sync(options.recursive ? `**/${pattern}` : pattern, {
        ...DELETE_CONFIG.globOptions,
        nodir: false,
      });
    }
    // 默认作为glob模式处理
    return glob.sync(pattern, {
      ...DELETE_CONFIG.globOptions,
      nodir: false,
    });
  });
  return nestedFilePathList.flat();
}

/**
 * 删除匹配指定模式的文件和目录
 * @param filePatterns 文件匹配模式数组
 * @param options 删除配置选项
 * @returns 删除结果
 */
export async function deleteFiles(
  filePatterns: string[],
  options: DeleteOptions
): Promise<DeleteResult> {
  const result: DeleteResult = {
    successFilesCount: 0,
    successDirsCount: 0,
    errorCount: 0,
    deletedPaths: new Set<string>(),
  };

  const matchedFiles = matchFiles(filePatterns, options);

  ui.showMatchedFiles(matchedFiles);

  await Promise.all(
    matchedFiles.map((file) => deleteItem(file, result, options))
  );

  return result;
}
