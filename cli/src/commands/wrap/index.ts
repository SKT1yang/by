import type { CAC } from 'cac';
import node_path from 'path';
import { wrap } from 'wrap_napi'
import { getVersion } from '../../utils'; 

import colors from 'chalk';

function runWrap(options: {
  root: string | string[]
  language: string | string[]
  include: string | string[]
  exclude: string | string[]
}) {
  // 获取当前文件夹路径

  const root = getPath(options.root, process.cwd());
  const language = getPath(options.language);
  const include = getPathArray(options.include);
  const exclude = getPathArray(options.exclude);

  //  处理根路径
  console.log(colors.green(`root: ${root}`), colors.green(`language: ${language}`), colors.green(`include: ${include}`), colors.green(`exclude: ${exclude}`));
  wrap(root, language, include, exclude);
}

function getPath(path: string | string[], __dirname?: string) {
  let result = ''
  if (typeof path === 'string') {
    result = __dirname !== undefined ? node_path.join(__dirname, path) : path;
  }

  if (Array.isArray(path) && path.length > 0) {
    result = __dirname !== undefined ? node_path.join(__dirname, path[0]) : path[0];
  }
  return result
}

function getPathArray(path: string | string[]) {
  return Array.isArray(path) ? path : [path]
}


function defineWrapCommand(cac: CAC) {
  cac
    .command('wrap')
    .version(getVersion())
    .usage(
      `国际化包裹函数 t, 支持 tsx, jsx, vue, js, ts, mjs, cjs`,
    )
    .option('--root [string]', '项目根目录', {
      default: "./",
    })
    .option('--language [string]', '语言文件目录', {
      default: "src/languages/index.ts",
    })
    .option('--include [string]', '需要包裹的文件目录', {
      default: "src",
    })
    .option('--exclude [string]', '需要排除的文件目录', {
      default: ["src/languages", "src/entry/languages"],
    })
    .action(
      async (options) => {
        runWrap(options);
      }
    );
}

export { defineWrapCommand, runWrap };
