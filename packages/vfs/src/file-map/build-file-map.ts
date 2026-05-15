import type {FileMap, FileMapEntry, ModEntry} from '../types';
import type {BuildOptions} from '../types/build-options';
import {normalizePath} from '../utils';
import {scanModDirectory} from './scan-mod-directory';

const buildFileMap = (async(
  mods: (readonly ModEntry[]),
  options?: BuildOptions
): Promise<FileMap> => {
  const caseSensitive = (options?.caseSensitive ?? false);
  const fileMap: FileMap = (new Map());

  const sortedMods = [...mods]
    .filter(mod => mod.enabled)
    .toSorted((a, b) => (a.priority - b.priority));

  for(const mod of sortedMods) {
    // eslint-disable-next-line no-await-in-loop
    const files = await scanModDirectory(mod.path);

    for(const file of files) {
      const key = normalizePath(file.relativePath, caseSensitive);
      const existing = fileMap.get(key);

      const source = {
        modName: mod.name,
        absolutePath: file.absolutePath,
        priority: mod.priority
      };

      if(existing) {
        const entry: FileMapEntry = {
          relativePath: file.relativePath,
          winner: source,
          losers: [...existing.losers, existing.winner],
          isDirectory: file.isDirectory
        };

        fileMap.set(key, entry);
      } else {
        fileMap.set(key, {
          relativePath: file.relativePath,
          winner: source,
          losers: [],
          isDirectory: file.isDirectory
        });
      }
    }
  }

  return fileMap;
});

export {
  buildFileMap
};
