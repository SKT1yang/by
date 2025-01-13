import { DeleteResult } from "./delete-core";

export class DeleteStats {
  private startTime = Date.now();
  private result: DeleteResult = {
    successFilesCount: 0,
    successDirsCount: 0,
    errorCount: 0,
    deletedPaths: new Set<string>(),
  };

  start() {
    this.startTime = Date.now();
    this.reset();
  }

  reset() {
    this.result = {
      successFilesCount: 0,
      successDirsCount: 0,
      errorCount: 0,
      deletedPaths: new Set<string>(),
    };
  }

  update(result: DeleteResult) {
    this.result.successFilesCount += result.successFilesCount;
    this.result.successDirsCount += result.successDirsCount;
    this.result.errorCount += result.errorCount;
    result.deletedPaths.forEach((path) => this.result.deletedPaths.add(path));
  }

  getStats() {
    const duration = Date.now() - this.startTime;
    return {
      ...this.result,
      duration,
    };
  }

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
