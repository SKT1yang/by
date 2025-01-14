import { consola } from "consola";
import colors from "chalk";
import { cac } from "cac";
import { getVersion } from "../utils";
import { definedeleteCommand } from "./delete/index";
import { defineWrapCommand } from "./wrap";

function installCli() {
  try {
    const by = cac("by");
    by.version(getVersion());

    defineWrapCommand(by);
    definedeleteCommand(by);

    // Invalid command
    by.on("command:*", () => {
      consola.error(colors.red("Invalid command!"));
      process.exit(1);
    });

    by.usage("by");
    by.help();
    by.parse();
  } catch (error) {
    consola.error(error);
    process.exit(1);
  }
}

export {
  installCli,
};
