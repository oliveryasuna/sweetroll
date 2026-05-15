import {lstat, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import type {ModEntry} from '../../src';
import {deploy, buildFileMap, readManifest} from '../../src';

// eslint-disable-next-line @typescript-eslint/init-declarations
let tempDir: string;
// eslint-disable-next-line @typescript-eslint/init-declarations
let modAPath: string;
// eslint-disable-next-line @typescript-eslint/init-declarations
let modBPath: string;
// eslint-disable-next-line @typescript-eslint/init-declarations
let targetDir: string;

beforeEach((async() => {
  tempDir = path.join(tmpdir(), `sweetroll-vfs-deploy-${Date.now()}`);
  modAPath = path.join(tempDir, 'mods', 'mod-a');
  modBPath = path.join(tempDir, 'mods', 'mod-b');
  targetDir = path.join(tempDir, 'data');

  await mkdir(path.join(modAPath, 'textures'), {recursive: true});
  await mkdir(path.join(modBPath, 'textures'), {recursive: true});
  await mkdir(targetDir, {recursive: true});

  await writeFile(path.join(modAPath, 'plugin.esp'), 'mod-a-plugin');
  await writeFile(path.join(modAPath, 'textures', 'body.dds'), 'mod-a-body');
  await writeFile(path.join(modBPath, 'textures', 'body.dds'), 'mod-b-body');
  await writeFile(path.join(modBPath, 'textures', 'cape.dds'), 'mod-b-cape');
}));

afterEach((async() => {
  await rm(tempDir, {
    recursive: true,
    force: true
  });
}));

describe('deploy', (() => {
  it('creates links in the target directory', (async() => {
    const mods: ModEntry[] = [
      {
        name: 'Mod A',
        path: modAPath,
        priority: 0,
        enabled: true
      },
      {
        name: 'Mod B',
        path: modBPath,
        priority: 1,
        enabled: true
      }
    ];

    const fileMap = await buildFileMap(mods);
    const manifest = await deploy(fileMap, {targetDir: targetDir});

    expect(manifest.links.length).toBeGreaterThanOrEqual(3);

    const pluginContent = await readFile(path.join(targetDir, 'plugin.esp'), 'utf8');

    expect(pluginContent).toBe('mod-a-plugin');
  }));

  it('winning mod content is deployed on conflict', (async() => {
    const mods: ModEntry[] = [
      {
        name: 'Mod A',
        path: modAPath,
        priority: 0,
        enabled: true
      },
      {
        name: 'Mod B',
        path: modBPath,
        priority: 1,
        enabled: true
      }
    ];

    const fileMap = await buildFileMap(mods);

    await deploy(fileMap, {targetDir: targetDir});

    const bodyContent = await readFile(path.join(targetDir, 'textures', 'body.dds'), 'utf8');

    expect(bodyContent).toBe('mod-b-body');
  }));

  it('writes a manifest file', (async() => {
    const mods: ModEntry[] = [
      {
        name: 'Mod A',
        path: modAPath,
        priority: 0,
        enabled: true
      }
    ];

    const fileMap = await buildFileMap(mods);

    await deploy(fileMap, {targetDir: targetDir});

    const manifest = await readManifest(
      path.join(targetDir, '.sweetroll-manifest.json')
    );

    expect(manifest.version).toBe(1);
    expect(manifest.links.length).toBeGreaterThanOrEqual(1);
  }));

  it('throws when deployment is already active', (async() => {
    const mods: ModEntry[] = [
      {
        name: 'Mod A',
        path: modAPath,
        priority: 0,
        enabled: true
      }
    ];

    const fileMap = await buildFileMap(mods);

    await deploy(fileMap, {targetDir: targetDir});

    await expect(
      deploy(fileMap, {targetDir: targetDir})
    ).rejects.toThrow('already active');
  }));

  it('dry run creates no files', (async() => {
    const mods: ModEntry[] = [
      {
        name: 'Mod A',
        path: modAPath,
        priority: 0,
        enabled: true
      }
    ];

    const fileMap = await buildFileMap(mods);
    const manifest = await deploy(fileMap, {
      targetDir: targetDir,
      dryRun: true
    });

    expect(manifest.links.length).toBeGreaterThanOrEqual(1);

    await expect(
      lstat(path.join(targetDir, 'plugin.esp'))
    ).rejects.toThrow();
  }));

  it('reports progress', (async() => {
    const progressEvents: number[] = [];
    const mods: ModEntry[] = [
      {
        name: 'Mod A',
        path: modAPath,
        priority: 0,
        enabled: true
      }
    ];

    const fileMap = await buildFileMap(mods);

    await deploy(fileMap, {
      targetDir: targetDir,
      onProgress: ((progress) => {
        progressEvents.push(progress.completed);
      })
    });

    expect(progressEvents.length).toBeGreaterThanOrEqual(1);
    expect(progressEvents.at(-1)).toBe(progressEvents.length);
  }));
}));
