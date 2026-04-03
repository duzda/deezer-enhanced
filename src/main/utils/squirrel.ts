import { spawn } from 'child_process';
import { app } from 'electron';
import path from 'path';

// Loosely based on: https://github.com/mongodb-js/electron-squirrel-startup/blob/master/index.js

const UPDATE_EXE = path.resolve(
  path.dirname(process.execPath),
  '..',
  'Update.exe'
);

const execute = (arg: string) => {
  spawn(UPDATE_EXE, [arg], {
    detached: true,
  }).on('close', app.quit);
};

export const checkSquirrel = (): boolean => {
  if (process.platform !== 'win32') {
    return false;
  }

  const cmd = process.argv[1];
  const target = path.basename(process.execPath);

  if (cmd === '--squirrel-install' || cmd === '--squirrel-updated') {
    execute(`--createShortcut=${target}`);
    return true;
  }
  if (cmd === '--squirrel-uninstall') {
    execute(`--removeShortcut=${target}`);
    return true;
  }
  if (cmd === '--squirrel-obsolete') {
    app.quit();
    return true;
  }

  return false;
};
