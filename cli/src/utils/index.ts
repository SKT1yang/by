import pkg from "../../package.json";

function getVersion() {
  return pkg.version;
}

export { getVersion };
