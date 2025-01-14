import { deleteFiles, DeleteOptions, DeleteResult } from "../commands/delete/delete-core";

/**
 * 文件删除API接口
 */
export class DeleteAPI {
  /**
   * 删除匹配指定模式的文件和目录
   * @param patterns 文件匹配模式数组
   * @param options 删除配置选项
   * @returns 删除结果
   */
  static async delete(patterns: string[], options?: DeleteOptions): Promise<DeleteResult> {
    return deleteFiles(patterns, options || {});
  }
}
