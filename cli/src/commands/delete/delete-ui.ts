import chalk from "chalk";
import ora from "ora";
import { DeleteStats } from "./delete-stats";

export class DeleteUI {
  private spinner = ora();

  showProgress(message: string) {
    this.spinner.text = message;
    this.spinner.start();
  }

  showSuccess(message: string) {
    this.spinner.succeed(message);
  }

  showError(message: string) {
    this.spinner.fail(message);
  }

  showWarning(message: string) {
    console.warn(chalk.yellow(`⚠ ${message}`));
  }

  showDeletedItem(path: string, isDirectory: boolean) {
    console.log(
      chalk.gray(
        `Deleted ${isDirectory ? "directory" : "file"}: ${path}`
      )
    );
  }

  showStats(stats: ReturnType<DeleteStats["formatStats"]>) {
    console.log(
      chalk.blueBright(`
    ┌──────────────────────────────┐
    │  成功: ${chalk.green(stats.totalSuccess.toString().padEnd(10))}
    │     --目录: ${chalk.green(stats.successDirs.toString().padEnd(10))}
    │     --文件: ${chalk.green(stats.successFiles.toString().padEnd(10))}
    │  失败: ${chalk.red(stats.errors.toString().padEnd(10))}
    │  耗时: ${chalk.yellow(stats.duration.toString() + ' ms')}
    └──────────────────────────────┘
    `)
    );
  }
}
