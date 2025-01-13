import { DeleteResult } from "./delete-core";

/**
 * 删除操作统计类
 * 
 * 记录成功/失败次数、删除路径和操作时长
 */
export class DeleteStats {
  private startTime = Date.now();
  private result: DeleteResult = {
    successFilesCount: 0,
    successDirsCount: 0,
    errorCount: 0,
    deletedPaths: new Set<string>(),
  };

  /**
   * 开始统计，重置计数器并记录开始时间
   */
  start() {
    this.startTime = Date.now();
    this.reset();
  }

  /**
   * 重置所有统计计数器，但保持开始时间不变
   */
  reset() {
    this.result = {
      successFilesCount: 0,
      successDirsCount: 0,
      errorCount: 0,
      deletedPaths: new Set<string>(),
    };
  }

  /**
   * 更新统计信息
   * @param result - 要累加的部分删除操作结果
   */
  update(result: DeleteResult) {
    this.result.successFilesCount += result.successFilesCount;
    this.result.successDirsCount += result.successDirsCount;
    this.result.errorCount += result.errorCount;
    result.deletedPaths.forEach((path) => this.result.deletedPaths.add(path));
  }

  /**
   * 获取当前统计信息，包括操作时长
   * @returns 完整的统计对象
   */
  getStats() {
    const duration = Date.now() - this.startTime;
    return {
      ...this.result,
      duration,
    };
  }

  /**
   * 格式化统计信息为更易读的结构
   * @returns 格式化后的统计对象
   */
  formatStats() {
    const stats = this.getStats();
    return {
      totalSuccess: stats.successFilesCount + stats.successDirsCount,
      successFiles: stats.successFilesCount,
      successDirs: stats.successDirsCount,
      errors: stats.errorCount,
      duration: stats.duration,
    };
  }
}
