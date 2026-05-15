import {access, mkdir, rename, writeFile} from 'node:fs/promises';
import path from 'node:path';
import type {DeployManifest, DeployedLink, FileMap, FileMapEntry, DeployOptions} from '../types';
import {batchAsync, isSameDevice} from '../utils';
import type {ResolvedLinkType} from './create-link';
import {createLink} from './create-link';

const assertTargetExists = (async(targetDir: string): Promise<void> => {
  try {
    await access(targetDir);
  } catch{
    const error = (new Error(`Target directory does not exist: ${targetDir}`));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    (error as (Error & {code: string;})).code = 'TARGET_DIR_NOT_FOUND';
    throw error;
  }
});

const assertNoActiveDeployment = (async(manifestPath: string): Promise<void> => {
  try {
    await access(manifestPath);
  } catch{
    // No manifest found — good.
    return;
  }

  const error = (new Error(`A deployment is already active. Purge first: ${manifestPath}`));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  (error as (Error & {code: string;})).code = 'DEPLOY_ALREADY_ACTIVE';
  throw error;
});

const determineSameDevice = (async(
  entries: (readonly FileMapEntry[]),
  targetDir: string
): Promise<boolean> => {
  if((entries.length === 0) || !entries[0]) {
    return true;
  }

  try {
    return await isSameDevice(entries[0].winner.absolutePath, targetDir);
  } catch{
    return false;
  }
});

const writeManifestAtomically = (async(manifest: DeployManifest, manifestPath: string): Promise<void> => {
  const tempPath = `${manifestPath}.tmp`;

  await writeFile(tempPath, JSON.stringify(manifest, null, 2));
  await rename(tempPath, manifestPath);
});

// eslint-disable-next-line max-lines-per-function, max-statements
const deploy = (async(
  fileMap: FileMap,
  options: DeployOptions
): Promise<DeployManifest> => {
  const targetDir = options.targetDir;
  const strategy = (options.strategy ?? 'auto');
  const concurrency = (options.concurrency ?? 64);
  const manifestPath = (options.manifestPath ?? path.join(targetDir, '.sweetroll-manifest.json'));
  const dryRun = (options.dryRun ?? false);

  await assertTargetExists(targetDir);
  await assertNoActiveDeployment(manifestPath);

  const entries = [...fileMap.values()]
    .filter(entry => !entry.isDirectory)
    .toSorted((a, b) => a.relativePath.localeCompare(b.relativePath));

  const createdDirs = (new Set<string>());
  const deployedLinks: DeployedLink[] = [];
  let completed = 0;

  const sameDevice = await determineSameDevice(entries, targetDir);

  const tasks = entries.map(entry => (async(): Promise<void> => {
    const targetPath = path.join(targetDir, entry.relativePath);
    const dirPath = path.dirname(targetPath);

    if(!createdDirs.has(dirPath)) {
      if(!dryRun) {
        await mkdir(dirPath, {recursive: true});
      }

      createdDirs.add(dirPath);
    }

    let linkType: ResolvedLinkType = 'copy';

    if(!dryRun) {
      const result = await createLink(entry.winner.absolutePath, targetPath, strategy, sameDevice);

      linkType = result.linkType;
    }

    deployedLinks.push({
      relativePath: entry.relativePath,
      targetPath: targetPath,
      sourcePath: entry.winner.absolutePath,
      linkType: linkType,
      isDirectory: false
    });

    completed++;
    options.onProgress?.({
      completed: completed,
      total: entries.length,
      currentFile: entry.relativePath
    });
  }));

  await batchAsync(tasks, concurrency);

  const manifest: DeployManifest = {
    version: 1,
    deployedAt: (new Date()).toISOString(),
    targetDir: targetDir,
    links: deployedLinks,
    createdDirs: [...createdDirs].toSorted((a, b) => a.localeCompare(b))
  };

  if(!dryRun) {
    await writeManifestAtomically(manifest, manifestPath);
  }

  return manifest;
});

export {
  deploy
};
