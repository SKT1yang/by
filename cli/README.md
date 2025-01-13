# by-simple-cli

shell 脚本工具集合

国际化函数包裹工具初步可用

## 使用方法

```shell
npm i by-simple-cli -g
```

```shell
by --help
```

```shell
by --version
```

目前配置项粗糙，后续将会完善，目前支持的命令行使用方法：

```shell
by wrap --root ./ --language src/languages/index.ts --include src --exclude src/languages --exclude src/entry/languages
```

默认配置参数

```javascript
    // .option('--root [string]', '项目根目录', {
    //   default: "./",
    // })
    // .option('--language [string]', '语言文件目录', {
    //   default: "src/languages/index.ts",
    // })
    // .option('--include [string]', '需要包裹的文件目录', {
    //   default: "src",
    // })
    // .option('--exclude [string]', '需要排除的文件目录', {
    //   default: ["src/languages", "src/entry/languages"],
    // })
```

## 功能

- [x] 国际化函数包裹工具
