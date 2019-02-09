import execa, { ExecaChildProcess } from 'execa';

export const runComposeCommand = (
  composeFile: string,
  projectName: string,
  command: string[]
) =>
  execa('docker-compose', [
    '--file',
    composeFile,
    '--project-name',
    projectName,
    ...command
  ]);

export const wrapEvents = (
  childProc: ExecaChildProcess,
  res: (data: any) => void,
  rej: (err: Error) => void
) => {
  childProc.stderr.pipe(process.stderr);
  childProc.stdout.pipe(process.stdout);

  childProc.on('error', rej);
  childProc.on('close', res);
};

export const build = (composeFilePath: string, projectName: string) =>
  new Promise((res, rej) => {
    const childProc = runComposeCommand(composeFilePath, projectName, [
      'build'
    ]);
    wrapEvents(childProc, res, rej);
  });

export const push = (composeFilePath: string, projectName: string) =>
  new Promise((res, rej) => {
    const childProc = runComposeCommand(composeFilePath, projectName, ['push']);
    wrapEvents(childProc, res, rej);
  });
