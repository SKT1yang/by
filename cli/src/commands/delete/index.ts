import type { CAC } from "cac";
import { getVersion } from "../../utils";
import { deleteFiles, DeleteOptions } from "./delete-core";
import { DeleteStats } from "./delete-stats";
import { ui } from "./delete-ui";

const stats = new DeleteStats();

// 命令配置
const COMMAND_CONFIG = {
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

/**
 * 定义删除命令
 * @param cac CAC实例
 */
function definedeleteCommand(cac: CAC) {
  const version = getVersion();
  cac
    .command(COMMAND_CONFIG.name)
    .version(version)
    .option(
      COMMAND_CONFIG.options[0].flag,
      COMMAND_CONFIG.options[0].description
    )
    .option(
      COMMAND_CONFIG.options[1].flag,
      COMMAND_CONFIG.options[1].description
    )
    .action(async (patterns: string[], options?: DeleteOptions) => {
      runDelete(patterns, options);
    });
}

/**
 * 删除操作
 * @param patterns 文件匹配模式
 * @param options 删除选项
 */
async function runDelete(patterns: string[], options?: DeleteOptions) {
  const {
    recursive = false,
    log = false,
    isDefaultMode = patterns.length === 0,
  } = options || {};
  try {
    stats.start();
    ui.showProgress("正在删除...\n");

    const result = await deleteFiles(patterns, {
      recursive: isDefaultMode ? true : recursive,
      log,
      isDefaultMode,
    });
    stats.update(result);

    ui.showSuccess("删除完成");
    ui.showStats(stats.formatStats());
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    ui.showError(`删除失败: ${errorMessage}`);
    process.exit(1);
  }
}

export { definedeleteCommand, runDelete };
