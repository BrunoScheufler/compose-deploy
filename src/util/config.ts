import { safeDump, safeLoad } from 'js-yaml';
import { resolve } from 'path';
import { IConfig } from '../types';
import { configSchema } from './validation';
import { readFile, writeFile, fileExists } from './fs';

export const defaultConfig: IConfig = {
  name: 'sample',
  targets: [
    {
      host: 'sample',
      username: 'deploy-user',
      privateKeyFile: '~/.ssh/id_rsa'
    }
  ],
  composeFile: './docker-compose.yml'
};

export const buildConfigPath = (dir: string = '.') =>
  resolve(dir, 'compose-deploy.yml');

export const loadConfig = async (dir?: string): Promise<IConfig> => {
  const configPath = buildConfigPath(dir);
  if (!(await fileExists(configPath))) {
    throw new Error('Configuration not found');
  }

  const fileContents = await readFile(configPath);
  const config = safeLoad(fileContents.toString());

  if (!(await configSchema.isValid(config))) {
    throw new Error('Invalid configuration');
  }

  return config;
};

export const writeConfig = async (data: IConfig, dir?: string) => {
  const parsedConfig = safeDump(data);
  await writeFile(buildConfigPath(dir), parsedConfig);
};
