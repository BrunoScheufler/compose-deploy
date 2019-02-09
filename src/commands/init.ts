import chalk from 'chalk';
import { CommandModule } from 'yargs';
import { IInitCommandArgs } from '../types';
import { writeConfig, defaultConfig } from '../util/config';

export const initCommand: CommandModule<{}, IInitCommandArgs> = {
  command: 'init [dir]',
  describe: 'initialize project',
  builder(b) {
    return b.positional('dir', {
      description: 'directory to create config file in',
      default: '.'
    });
  },
  async handler(args) {
    await writeConfig(defaultConfig, args.dir);
    console.log(
      chalk.green(`🎉 Initialized compose-deploy project configuration`)
    );
  }
};
