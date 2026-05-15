import {access, mkdir, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import type {ModEntry} from '../../src';
import {deploy, buildFileMap, purge, purgeFromDisk} from '../../src';

// eslint-disable-next-line @typescript-eslint/init-declarations
let tempDir: string;
// eslint-disable-next-line @typescript-eslint/init-declarations
let modPath: string;
// eslint-disable-next-line @typescript-eslint/init-declarations
let targetDir: string;

beforeEach((async() => {
  tempDir = path.join(tmpdir(), `sweetroll-vfs-purge-${Date.now()}`);
  modPath = path.join(tempDir, 'mods', 'test-mod');
  targetDir = path.join(tempDir, 'data');

  await mkdir(path.join(modPath, 'textures'), {recursive: true});
  await mkdir(targetDir, {recursive: true});

  await writeFile(path.join(modPath, 'plugin.esp'), 'test-plugin');
  await writeFile(path.join(modPath, 'textures', 'body.dds'), 'test-body');
}));

afterEach((async() => {
  await rm(tempDir, {
    recursive: true,
    force: true
  });
}));

describe('purge', (() => {
  it('removes all deployed links', (async() => {
    const mods: ModEntry[] = [
      {
        name: 'Test Mod',
        path: modPath,
        priority: 0,
        enabled: true
      }
    ];

    const fileMap = await buildFileMap(mods);
    const manifest = await deploy(fileMap, {targetDir: targetDir});
    const result = await purge(manifest);

    expect(result.removedLinks).toBeGreaterThanOrEqual(1);
    expect(result.errors).toHaveLength(0);

    await expect(
      access(path.join(targetDir, 'plugin.esp'))
    ).rejects.toThrow();
  }));

  it('removes empty directories', (async() => {
    const mods: ModEntry[] = [
      {
        name: 'Test Mod',
        path: modPath,
        priority: 0,
        enabled: true
      }
    ];

    const fileMap = await buildFileMap(mods);
    const manifest = await deploy(fileMap, {targetDir: targetDir});
    const result = await purge(manifest);

    expect(result.removedDirs).toBeGreaterThanOrEqual(0);

    await expect(
      access(path.join(targetDir, 'textures'))
    ).rejects.toThrow();
  }));

  it('removes the manifest file', (async() => {
    const mods: ModEntry[] = [
      {
        name: 'Test Mod',
        path: modPath,
        priority: 0,
        enabled: true
      }
    ];

    const fileMap = await buildFileMap(mods);
    const manifest = await deploy(fileMap, {targetDir: targetDir});

    await purge(manifest);

    await expect(
      access(path.join(targetDir, '.sweetroll-manifest.json'))
    ).rejects.toThrow();
  }));
}));

describe('purgeFromDisk', (() => {
  it('reads manifest and purges', (async() => {
    const mods: ModEntry[] = [
      {
        name: 'Test Mod',
        path: modPath,
        priority: 0,
        enabled: true
      }
    ];

    const fileMap = await buildFileMap(mods);

    await deploy(fileMap, {targetDir: targetDir});

    const manifestPath = path.join(targetDir, '.sweetroll-manifest.json');
    const result = await purgeFromDisk(manifestPath);

    expect(result.removedLinks).toBeGreaterThanOrEqual(1);
    expect(result.errors).toHaveLength(0);
  }));
}));
