import {writeFile} from 'node:fs/promises';
import {styleText} from 'node:util';
// eslint-disable-next-line import-x/no-deprecated
import {builtinRules} from 'eslint/use-at-your-own-risk';
import {flatConfigsToRulesDTS} from 'eslint-typegen/core';
import type {Config} from '../src';
import {eslint, presetAll} from '../src';

const PRESET_ALL = presetAll(process.cwd(), {tsconfigs: ['./tsconfig.json']});

// eslint-disable-next-line import-x/no-deprecated
const configs: Config[] = (await eslint(PRESET_ALL).prepend({plugins: {'': {rules: Object.fromEntries(builtinRules)}}}));

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-type-assertion
let dts = (await flatConfigsToRulesDTS((configs as any), {
  includeAugmentation: false,
  exportTypeName: 'Rules'
  // filterPlugin: ((name: string): boolean => (name !== 'oliveryasuna'))
}));

const configNames = (configs
  .map((config: Config): (string | undefined) => config.name)
  .filter(Boolean));
dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map((configName: string): string => `'${configName}'`).join(' | ')};
`;

await writeFile('./src/typegen.d.ts', dts);

// eslint-disable-next-line no-console
console.log(styleText('green', 'Type definitions generated!'));
