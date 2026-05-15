import {describe, it, expect} from 'vitest';
import type {FileMap, FileMapEntry} from '../../src';
import {resolveConflicts} from '../../src';

const makeEntry = ((
  relativePath: string,
  winnerMod: string,
  loserMods: string[]
): FileMapEntry => ({
  relativePath: relativePath,
  winner: {
    modName: winnerMod,
    absolutePath: `/mods/${winnerMod}/${relativePath}`,
    priority: 1
  },
  losers: loserMods.map((name, index) => ({
    modName: name,
    absolutePath: `/mods/${name}/${relativePath}`,
    priority: index
  })),
  isDirectory: false
}));

describe('resolveConflicts', (() => {
  it('returns empty entries when no conflicts exist', (() => {
    const fileMap: FileMap = (new Map([
      ['textures/body.dds', makeEntry('textures/body.dds', 'Mod A', [])],
      ['meshes/sword.nif', makeEntry('meshes/sword.nif', 'Mod B', [])]
    ]));

    const report = resolveConflicts(fileMap);

    expect(report.totalFiles).toBe(2);
    expect(report.conflictedFiles).toBe(0);
    expect(report.entries).toHaveLength(0);
  }));

  it('reports conflicting files', (() => {
    const fileMap: FileMap = (new Map([
      ['textures/body.dds', makeEntry('textures/body.dds', 'Mod B', ['Mod A'])],
      ['meshes/sword.nif', makeEntry('meshes/sword.nif', 'Mod B', [])]
    ]));

    const report = resolveConflicts(fileMap);

    expect(report.totalFiles).toBe(2);
    expect(report.conflictedFiles).toBe(1);
    expect(report.entries).toHaveLength(1);
    expect(report.entries[0]?.winnerMod).toBe('Mod B');
    expect(report.entries[0]?.loserMods).toEqual(['Mod A']);
  }));

  it('reports multiple losers', (() => {
    const fileMap: FileMap = (new Map([
      ['textures/body.dds', makeEntry('textures/body.dds', 'Mod C', ['Mod A', 'Mod B'])]
    ]));

    const report = resolveConflicts(fileMap);

    expect(report.entries[0]?.loserMods).toEqual(['Mod A', 'Mod B']);
  }));
}));
