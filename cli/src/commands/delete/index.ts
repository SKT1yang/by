import type { CAC } from "cac";
import { getVersion } from "../../utils";
import { deleteFiles } from "./delete-core";
import { DeleteStats } from "./delete-stats";
import { DeleteUI } from "./delete-ui";

export function definedeleteCommand(cac: CAC) {
  const version = getVersion();
  const stats = new DeleteStats();
  const ui = new DeleteUI();

  cac
    .command("delete [...patterns]")
    .version(version)
    .option("-r, recursive", "递归删除，删除指定目录下的所有文件和子目录")
    .action(
      async (
        patterns: string[],
        options: { recursive?: boolean } = { recursive: false }
      ) => {
        try {
          stats.start();
          ui.showProgress("正在删除...");
          
          const result = await deleteFiles(patterns, options.recursive);
          stats.update(result);
          
          ui.showSuccess("删除完成");
          ui.showStats(stats.formatStats());
        } catch (err) {
          ui.showError(`删除失败: ${String(err)}`);
          process.exit(1);
        }
      }
    );
}
