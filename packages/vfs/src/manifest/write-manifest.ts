import {rename, writeFile} from 'node:fs/promises';
import type {DeployManifest} from '../types';

const writeManifest = (async(manifest: DeployManifest, manifestPath: string): Promise<void> => {
  const tempPath = `${manifestPath}.tmp`;

  await writeFile(tempPath, JSON.stringify(manifest, null, 2));
  await rename(tempPath, manifestPath);
});

export {
  writeManifest
};
