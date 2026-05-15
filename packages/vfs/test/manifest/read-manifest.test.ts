import {mkdir, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {readManifest} from '../../src';

// eslint-disable-next-line @typescript-eslint/init-declarations
let tempDir: string;

beforeAll((async() => {
  tempDir = path.join(tmpdir(), `sweetroll-vfs-manifest-${Date.now()}`);
  await mkdir(tempDir, {recursive: true});
}));

afterAll((async() => {
  await rm(tempDir, {
    recursive: true,
    force: true
  });
}));

describe('readManifest', (() => {
  it('reads a valid manifest', (async() => {
    const manifestPath = path.join(tempDir, 'valid.json');

    await writeFile(manifestPath, JSON.stringify({
      version: 1,
      deployedAt: '2026-01-01T00:00:00.000Z',
      targetDir: '/game/data',
      links: [{
        relativePath: 'plugin.esp',
        targetPath: '/game/data/plugin.esp',
        sourcePath: '/mods/test/plugin.esp',
        linkType: 'hardlink',
        isDirectory: false
      }],
      createdDirs: []
    }));

    const manifest = await readManifest(manifestPath);

    expect(manifest.version).toBe(1);
    expect(manifest.links).toHaveLength(1);
  }));

  it('throws MANIFEST_NOT_FOUND for missing file', (async() => {
    await expect(
      readManifest(path.join(tempDir, 'nonexistent.json'))
    ).rejects.toThrow('not found');
  }));

  it('throws MANIFEST_CORRUPT for invalid JSON', (async() => {
    const manifestPath = path.join(tempDir, 'invalid.json');

    await writeFile(manifestPath, 'not json');

    await expect(
      readManifest(manifestPath)
    ).rejects.toThrow('not valid JSON');
  }));

  it('throws MANIFEST_CORRUPT for invalid schema', (async() => {
    const manifestPath = path.join(tempDir, 'bad-schema.json');

    await writeFile(manifestPath, JSON.stringify({version: 999}));

    await expect(
      readManifest(manifestPath)
    ).rejects.toThrow('validation failed');
  }));
}));
