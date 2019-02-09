import { Client, ConnectConfig } from 'ssh2';

export const client = new Client();

/**
 * Connect to server
 * @param options SSH options
 */
export const connect = (options: ConnectConfig) =>
  new Promise(res => {
    client.connect(options);
    client.on('ready', res);
  });

export const disconnect = () => client.end();

/**
 * Executes command, doesn't persist state
 * @param command command (with arguments)
 */
export const exec = (command: string) =>
  new Promise((res, rej) => {
    client.exec(command, (err, channel) => {
      if (err) {
        rej(err);
      }

      channel.stdout.pipe(process.stdout);
      channel.stderr.pipe(process.stderr);

      channel.on('close', res);
    });
  });

/**
 * Uploads file to server
 * @param localPath absolute path of local file
 * @param remotePath absolute path of remote file
 */
export const uploadFile = (localPath: string, remotePath: string) =>
  new Promise((res, rej) => {
    client.sftp((err, sftp) => {
      if (err) {
        rej(err);
      }

      sftp.fastPut(localPath, remotePath, err2 => {
        if (err2) {
          sftp.end();
          rej(err);
        }
        res();
      });
    });
  });

/**
 * Checks if file exists on the server
 * @param path absolute path of file
 */
export const remoteFileExists = (path: string) =>
  new Promise((res, rej) => {
    client.sftp((err, sftp) => {
      if (err) {
        rej(err);
      }

      sftp.stat(path, (err2, _) => {
        if (err2) {
          sftp.end();
          res(false);
        }

        sftp.end();
        res(true);
      });
    });
  });
