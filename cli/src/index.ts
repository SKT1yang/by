import { consola } from 'consola';
import colors from 'chalk';
import { getVersion } from './utils';
import { cac } from 'cac';
import { defineWrapCommand } from './commands/wrap';
import { definedeleteCommand } from './commands/delete';

try {
  const by = cac('by');
  by.version(getVersion());

  defineWrapCommand(by);
  definedeleteCommand(by);


  // Invalid command
  by.on('command:*', () => {
    consola.error(colors.red('Invalid command!'));
    process.exit(1);
  });

  by.usage('by');
  by.help();
  by.parse();
} catch (error) {
  consola.error(error);
  process.exit(1);
}
