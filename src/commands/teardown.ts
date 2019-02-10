import { CommandModule } from 'yargs';
import { ITeardownCommandArgs } from '../types';
import { loadConfig } from '../util/config';
import { readFileOptional } from '../util/fs';
import {
  connect,
  getRemotePaths,
  remoteFileExists,
  exec,
  disconnect
} from '../util/ssh';

export const teardownCommand: CommandModule<{}, ITeardownCommandArgs> = {
  command: 'teardown',
  aliases: ['down', 'rm'],
  describe: 'Stop all running deployments',
  builder(b) {
    return b
      .option('config', {
        alias: 'cfg',
        default: '.',
        describe: 'Configuration file directory',
        string: true
      })
      .option('volumes', {
        alias: 'v',
        default: true,
        describe: 'Remove named & anonymous volumes',
        boolean: true
      })
      .option('orphans', {
        alias: 'remove-orphans',
        default: true,
        describe: 'Remove containers for undefined services',
        boolean: true
      });
  },
  async handler(args) {
    const { config, orphans, volumes } = args;
    const { name, targets } = await loadConfig(config);

    const teardownOptions = `${orphans ? '--remove-orphans' : ''} ${
      volumes ? '--volumes' : ''
    }`;

    for (const deploymentTargetIndex in targets) {
      const { privateKeyFile, username, ...rest } = targets[
        deploymentTargetIndex
      ];
      console.log(
        `💥 Tearing down deployment ${parseInt(deploymentTargetIndex) + 1} of ${
          targets.length
        }`
      );

      const privateKey = await readFileOptional(privateKeyFile);

      console.log('📡 Connecting to target server');
      await connect({ ...rest, username, privateKey });

      const { remoteFilePath, remoteDirPath } = getRemotePaths(username, name);

      if (!(await remoteFileExists(remoteFilePath))) {
        continue;
      }

      console.log('🎳 Tearing down...');

      await exec(
        `cd ${remoteDirPath} && docker-compose down ${teardownOptions}`
      );

      disconnect();

      console.log('✅ Teardown completed');
    }

    console.log('✨ Teardown completed for all deployment targets!');
  }
};
