/*
  Configuration
*/

export interface IConfig {
  name: string;
  composeFile?: string;
  targets: IDeploymentTarget[];
}

// Mostly from https://github.com/mscdex/ssh2#client-methods
export interface IDeploymentTarget {
  host: string;
  username: string;
  password?: string;
  privateKeyFile?: string;
  passphrase?: string;
}

/*
  Command args
*/

export interface IInitCommandArgs {
  dir: string;
}

export interface IDeployCommandArgs {
  config: string;
}

/*
  SSH
*/
