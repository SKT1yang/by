import ora from "ora";
import type { DeleteStats } from "./delete-stats";
import { UI_STYLES } from "./constants";

/**
 * 删除操作UI模块
 * 提供删除操作的进度显示、结果展示等UI功能
 */

/**
 * 删除操作的UI交互类
 */
export class DeleteUI {
  private spinner = ora();

  /**
   * 显示进度信息
   * @param message 要显示的消息
   */

  showProgress(message: string) {
    this.spinner.text = message;
    this.spinner.start();
  }

  /**
   * 显示成功信息
   * @param message 要显示的消息
   */
  showSuccess(message: string) {
    console.log('\n');
    this.spinner.succeed(message);
  }

  /**
   * 显示错误信息
   * @param message 要显示的消息
   */
  showError(message: string) {
    console.log('\n');
    this.spinner.fail(message);
  }

  /**
   * 显示警告信息
   * @param message 要显示的消息
   */
  showWarning(message: string) {
    console.warn(UI_STYLES.warning(`⚠ ${message}`));
  }

  /**
   * 显示已删除的项目信息
   * @param path 删除的路径
   * @param isDirectory 是否是目录
   */
  showDeletedItem(path: string, type: "file" | "directory" | 'notExist') {
    let message = `Deleted ${type}: ${path}`;
    if (type === "notExist") {
      // 跳过不存在的文件
      message = `Not exist, maybe deleted: ${path}`;
    }
    console.log(UI_STYLES.detail(message));
  }

  showMatchedFiles(files: string[]) {
    console.log(UI_STYLES.info(`Matched files:\n${JSON.stringify(files, null, 2)}`));
  }

  /**
   * 显示统计信息
   * @param stats 格式化后的统计信息
   */
  /**
   * 显示统计信息
   * @param stats 格式化后的统计信息
   */
  showStats(stats: ReturnType<DeleteStats["formatStats"]>) {
    const statsTemplate = UI_STYLES.info(`
    ┌──────────────────────────────┐
    │  成功: ${UI_STYLES.success(stats.totalSuccess.toString().padEnd(10))}
    │     --目录: ${UI_STYLES.success(stats.successDirs.toString().padEnd(10))}
    │     --文件: ${UI_STYLES.success(stats.successFiles.toString().padEnd(10))}
    │  失败: ${UI_STYLES.error(stats.errors.toString().padEnd(10))}
    │  耗时: ${UI_STYLES.warning(stats.duration.toString() + " ms")}
    └──────────────────────────────┘
    `);

    console.log(statsTemplate);
  }
}

export const ui = new DeleteUI();
