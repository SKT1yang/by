import fs from "fs";
import wrapTFunction from './wrap-t-function.js'

const pkg = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8"));

const plugin = {
  // preferred location of name and version
  meta: {
    name: pkg.name,
    version: pkg.version,
  },

  configs: {},
  rules: {
    "wrap-t-function": wrapTFunction
  },
  processors: {}
};

// for ESM
export default plugin;
