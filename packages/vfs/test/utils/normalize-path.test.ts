import {describe, it, expect} from 'vitest';
import {normalizePath} from '../../src';

describe('normalizePath', (() => {
  it('converts backslashes to forward slashes', (() => {
    expect(normalizePath(String.raw`textures\armor\iron.dds`)).toBe('textures/armor/iron.dds');
  }));

  it('lowercases by default (case-insensitive)', (() => {
    expect(normalizePath('Textures/Armor/Iron.dds')).toBe('textures/armor/iron.dds');
  }));

  it('preserves case when caseSensitive is true', (() => {
    expect(normalizePath('Textures/Armor/Iron.dds', true)).toBe('Textures/Armor/Iron.dds');
  }));

  it('handles mixed separators', (() => {
    expect(normalizePath(String.raw`meshes\actors/character\hair.nif`)).toBe('meshes/actors/character/hair.nif');
  }));

  it('handles empty string', (() => {
    expect(normalizePath('')).toBe('');
  }));
}));
