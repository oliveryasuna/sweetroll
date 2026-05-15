import {link, mkdir, rmdir, symlink, unlink, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import type {LinkCapabilities} from '../types';

// eslint-disable-next-line max-statements
const detectLinkCapabilities = (async(): Promise<LinkCapabilities> => {
  const tempDir = path.join(tmpdir(), `sweetroll-vfs-probe-${Date.now()}`);

  await mkdir(tempDir, {recursive: true});

  const sourceFile = path.join(tempDir, 'source');

  await writeFile(sourceFile, '');

  let hardlinkSupported = false;
  let symlinkSupported = false;
  let symlinkRequiresAdmin = false;

  try {
    const hardlinkTarget = path.join(tempDir, 'hardlink');

    await link(sourceFile, hardlinkTarget);
    hardlinkSupported = true;
    await unlink(hardlinkTarget);
  } catch{
    // Hardlinks not supported.
  }

  try {
    const symlinkTarget = path.join(tempDir, 'symlink');

    await symlink(sourceFile, symlinkTarget);
    symlinkSupported = true;
    await unlink(symlinkTarget);
  } catch(err) {
    if((err instanceof Error) && ('code' in err) && (err.code === 'EPERM')) {
      symlinkRequiresAdmin = true;
    }
  }

  await unlink(sourceFile);
  await rmdir(tempDir);

  return {
    hardlink: hardlinkSupported,
    symlink: symlinkSupported,
    symlinkRequiresAdmin: symlinkRequiresAdmin,
    copyFallback: true
  };
});

export {
  detectLinkCapabilities
};
