import { promisify } from 'util';
import {
  writeFile as fsWriteFile,
  readFile as fsReadFile,
  stat as fsStat
} from 'fs';

export const readFile = promisify(fsReadFile);
export const writeFile = promisify(fsWriteFile);
export const stat = promisify(fsStat);

export const fileExists = async (path: string) => {
  try {
    const fileDetails = await stat(path);
    return fileDetails.isFile() && !fileDetails.isDirectory();
  } catch (err) {
    return false;
  }
};
