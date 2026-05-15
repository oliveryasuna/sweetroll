import {readdir} from 'node:fs/promises';
import path from 'node:path';

interface ScannedFile {
  readonly relativePath: string;
  readonly absolutePath: string;
  readonly isDirectory: boolean;
}

const scanModDirectory = (async(modPath: string): Promise<ScannedFile[]> => {
  const entries = await readdir(modPath, {
    recursive: true,
    withFileTypes: true
  });
  const files: ScannedFile[] = [];

  for(const entry of entries) {
    const absolutePath = path.join(entry.parentPath, entry.name);
    const relativePath = path.relative(modPath, absolutePath);

    files.push({
      relativePath: relativePath,
      absolutePath: absolutePath,
      isDirectory: entry.isDirectory()
    });
  }

  return files;
});

export type {
  ScannedFile
};
export {
  scanModDirectory
};
