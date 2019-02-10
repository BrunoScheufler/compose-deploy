#!/usr/bin/env node

import yargs from 'yargs';
import chalk from 'chalk';

import { initCommand } from './commands/init';
import { deployCommand } from './commands/deploy';
import { teardownCommand } from './commands/teardown';

const handleError = (err: Error) => {
  console.error(chalk.red(err.message));
  process.exit(1);
};

process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);

const { argv } = yargs
  .scriptName('compose-deploy')
  .command(initCommand)
  .command(deployCommand)
  .command(teardownCommand)
  .locale('en')
  .showHelpOnFail(false)
  .help();

if (process.env.DEBUG) {
  console.log(argv);
}
