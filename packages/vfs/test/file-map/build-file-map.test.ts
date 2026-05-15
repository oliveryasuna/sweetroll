import {mkdir, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import type {ModEntry} from '../../src';
import {buildFileMap} from '../../src';

// eslint-disable-next-line @typescript-eslint/init-declarations
let tempDir: string;
// eslint-disable-next-line @typescript-eslint/init-declarations
let modAPath: string;
// eslint-disable-next-line @typescript-eslint/init-declarations
let modBPath: string;

beforeAll((async() => {
  tempDir = path.join(tmpdir(), `sweetroll-vfs-test-${Date.now()}`);
  modAPath = path.join(tempDir, 'mod-a');
  modBPath = path.join(tempDir, 'mod-b');

  await mkdir(path.join(modAPath, 'textures'), {recursive: true});
  await mkdir(path.join(modBPath, 'textures'), {recursive: true});
  await mkdir(path.join(modBPath, 'meshes'), {recursive: true});

  await writeFile(path.join(modAPath, 'textures', 'body.dds'), 'a-body');
  await writeFile(path.join(modAPath, 'textures', 'head.dds'), 'a-head');
  await writeFile(path.join(modBPath, 'textures', 'body.dds'), 'b-body');
  await writeFile(path.join(modBPath, 'meshes', 'sword.nif'), 'b-sword');
}));

afterAll((async() => {
  const {rm} = await import('node:fs/promises');

  await rm(tempDir, {
    recursive: true,
    force: true
  });
}));

describe('buildFileMap', (() => {
  it('builds a file map from multiple mods', (async() => {
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

    expect(fileMap.size).toBeGreaterThanOrEqual(3);
  }));

  it('higher priority mod wins conflicts', (async() => {
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
    const bodyEntry = fileMap.get('textures/body.dds');

    expect(bodyEntry).toBeDefined();
    expect(bodyEntry?.winner.modName).toBe('Mod B');
    expect(bodyEntry?.losers).toHaveLength(1);
    expect(bodyEntry?.losers[0]?.modName).toBe('Mod A');
  }));

  it('skips disabled mods', (async() => {
    const mods: ModEntry[] = [
      {
        name: 'Mod A',
        path: modAPath,
        priority: 0,
        enabled: false
      },
      {
        name: 'Mod B',
        path: modBPath,
        priority: 1,
        enabled: true
      }
    ];

    const fileMap = await buildFileMap(mods);
    const headEntry = fileMap.get('textures/head.dds');

    expect(headEntry).toBeUndefined();
  }));

  it('includes non-conflicting files from all mods', (async() => {
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
    const swordEntry = fileMap.get('meshes/sword.nif');

    expect(swordEntry).toBeDefined();
    expect(swordEntry?.winner.modName).toBe('Mod B');
    expect(swordEntry?.losers).toHaveLength(0);
  }));
}));
