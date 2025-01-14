/**
 * 删除操作相关常量配置
 */

// 删除操作配置
export const DELETE_CONFIG = {
  globOptions: {
    cwd: process.cwd(),
    absolute: true,
  },
  errorMessages: {
    directoryWithoutRecursive: "Directory found. Use -r to delete directories.",
  },
  default: {
    files: ["**/dist", "**/node_modules", "**/.turbo", "**/es", "**/cjs"],
    lock: ["**/package-lock.json", "**/yarn.lock", "**/pnpm-lock.yaml"],
  },
};

import chalk from "chalk";

// UI样式常量
export const UI_STYLES = {
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.blueBright,
  detail: chalk.gray,
};

// 命令配置
export const COMMAND_CONFIG = {
  name: "delete [...patterns]",
  description: "删除指定模式匹配的文件和目录",
  options: [
    {
      flag: "-r, recursive",
      description: "递归删除，删除指定目录下的所有文件和子目录",
    },
    {
      flag: "-l, log",
      description: "输出删除日志",
    },
  ],
};
