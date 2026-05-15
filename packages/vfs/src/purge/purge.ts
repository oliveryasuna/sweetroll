import {readdir, rm, rmdir, unlink} from 'node:fs/promises';
import {readManifest} from '../manifest';
import type {DeployManifest, PurgeOptions, PurgeResult} from '../types';
import {batchAsync} from '../utils';

const removeEmptyDirectories = (async(dirs: (readonly string[])): Promise<number> => {
  const sortedDirs = [...dirs].toSorted(
    (a, b) => (b.length - a.length)
  );

  let removedDirs = 0;

  for(const dir of sortedDirs) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const remaining = await readdir(dir);

      if(remaining.length === 0) {
        // eslint-disable-next-line no-await-in-loop
        await rmdir(dir);
        removedDirs++;
      }
    } catch{
      // Directory may already be gone.
    }
  }

  return removedDirs;
});

const removeManifestFile = (async(manifest: DeployManifest, options?: PurgeOptions): Promise<void> => {
  try {
    const manifestPath = (options?.manifestPath
      ?? `${manifest.targetDir}/.sweetroll-manifest.json`);

    await unlink(manifestPath);
  } catch{
    // Manifest may already be gone.
  }
});

// eslint-disable-next-line max-lines-per-function
const purge = (async(
  manifest: DeployManifest,
  options?: PurgeOptions
): Promise<PurgeResult> => {
  const removeEmptyDirs = (options?.removeEmptyDirs ?? true);
  const concurrency = (options?.concurrency ?? 64);

  const errors: {path: string;
    error: string;}[] = [];
  let removedLinks = 0;
  let completed = 0;
  const total = manifest.links.length;

  const tasks = manifest.links.map(linkEntry => (async(): Promise<void> => {
    try {
      await (linkEntry.isDirectory
        ? rm(linkEntry.targetPath, {
            recursive: true,
            force: true
          })
        : unlink(linkEntry.targetPath));

      removedLinks++;
    } catch(err) {
      const message = ((err instanceof Error) ? err.message : String(err));

      errors.push({
        path: linkEntry.targetPath,
        error: message
      });
    }

    completed++;
    options?.onProgress?.({
      completed: completed,
      total: total
    });
  }));

  await batchAsync(tasks, concurrency);

  const removedDirs = (removeEmptyDirs
    ? await removeEmptyDirectories(manifest.createdDirs)
    : 0);

  await removeManifestFile(manifest, options);

  return {
    removedLinks: removedLinks,
    removedDirs: removedDirs,
    errors: errors
  };
});

const purgeFromDisk = (async(
  manifestPath: string,
  options?: PurgeOptions
): Promise<PurgeResult> => {
  const manifest = await readManifest(manifestPath);

  return purge(manifest, {
    ...options,
    manifestPath: manifestPath
  });
});

export {
  purge,
  purgeFromDisk
};
