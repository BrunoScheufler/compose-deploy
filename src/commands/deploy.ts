import { CommandModule } from 'yargs';
import { loadConfig } from '../util/config';
import { IDeployCommandArgs } from '../types';
import { resolve } from 'path';
import { fileExists, readFileOptional } from '../util/fs';
import { build, push } from '../util/docker';
import {
  connect,
  disconnect,
  exec,
  uploadFile,
  remoteFileExists,
  getRemotePaths
} from '../util/ssh';

export const deployCommand: CommandModule<{}, IDeployCommandArgs> = {
  command: 'deploy',
  aliases: ['up', '*'],
  // tslint:disable-next-line
  describe: `Deploy a docker-compose file using the existing compose-deploy configuration.`,
  builder(b) {
    return b
      .option('config', {
        alias: 'cfg',
        default: '.',
        describe: 'Configuration file directory',
        string: true
      })
      .option('scale', {
        default: [],
        describe: 'Scale service instances',
        array: true
      });
  },
  async handler(args) {
    const { config, scale } = args;
    const { composeFile, name, targets } = await loadConfig(config);

    // Check if local compose file exists
    const composeFilePath = resolve(composeFile || 'docker-compose.yml');
    if (!(await fileExists(composeFilePath))) {
      throw new Error('Could not find Compose file');
    }

    // Build images
    console.log('🔨 Building Docker images...');
    await build(composeFilePath, name);

    // Push images
    console.log('🌎 Pushing Docker images...');
    await push(composeFilePath, name);

    // Deploy
    console.log('🎯 Deploying services...');
    for (const deploymentTargetIndex in targets) {
      const { privateKeyFile, username, ...rest } = targets[
        deploymentTargetIndex
      ];

      console.log(
        `💫 Deploying to target ${parseInt(deploymentTargetIndex) + 1} of ${
          targets.length
        }...`
      );

      // Load private key if supplied
      const privateKey = await readFileOptional(privateKeyFile);

      // Pass all config keys into connect
      console.log('📡 Connecting to target server');
      await connect({ ...rest, username, privateKey });

      console.log('🥁 Connected! Copying Compose file...');

      const { remoteDirPath, remoteFilePath } = getRemotePaths(username, name);

      // Stop existing deployments, delete old compose file
      if (await remoteFileExists(remoteFilePath)) {
        console.log(
          '👀 Found deployment for this project, shutting it down...'
        );
        await exec(`cd ${remoteDirPath} && docker-compose down`);
        await exec(`rm ${remoteFilePath}`);
      }

      // Create directory
      await exec(`mkdir -p ${remoteDirPath}`);

      // Create compose file on server and transfer data
      await uploadFile(composeFilePath, remoteFilePath);

      console.log('📦 Pulling Docker images...');
      await exec(`cd ${remoteDirPath} && docker-compose pull`);

      console.log('⚡️ Launching deployment...');
      await exec(
        `cd ${remoteDirPath} && docker-compose up -d ${scale
          .map(s => `--scale ${s}`)
          .join(' ')}`
      );

      disconnect();

      console.log('✅ Deployment done!');
    }

    console.log('🙌 All services deployed!');
  }
};
