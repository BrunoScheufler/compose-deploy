#!/usr/bin/env node

import yargs from 'yargs';
import { initCommand } from './commands/init';
import { deployCommand } from './commands/deploy';
import chalk from 'chalk';

const handleError = (err: Error) => {
  console.error(chalk.red(err.message));
  console.error(err.stack);
  process.exit(1);
};

process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);

const { argv } = yargs
  .scriptName('compose-deploy')
  .alias('*', 'help')
  .command(initCommand)
  .command(deployCommand)
  .locale('en')
  .showHelpOnFail(false)
  .help();

if (process.env.DEBUG) {
  console.log(argv);
}
