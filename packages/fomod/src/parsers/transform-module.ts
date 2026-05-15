/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type {ConditionalFileInstallList, ConditionalInstallPattern, HeaderImage, ModuleConfiguration, ModuleTitle} from '../schemas';
import {transformCompositeDependency} from './transform-dependencies';
import {transformFileList} from './transform-files';
import {transformStepList} from './transform-plugins';
import {toArray, parseBool, parseIntVal, textContent, attr} from './xml-utils';

const transformHeaderImage = ((raw: any): HeaderImage => ({
  path: (raw['@_path'] ?? undefined),
  showImage: parseBool(raw['@_showImage'], true),
  showFade: parseBool(raw['@_showFade'], true),
  height: parseIntVal(raw['@_height'], -1)
}));

const transformModuleTitle = ((raw: any): ModuleTitle => ({
  value: textContent(raw),
  position: ((attr(raw, 'position') ?? 'Left') as ModuleTitle['position']),
  colour: (attr(raw, 'colour') ?? '000000')
}));

const transformConditionalInstallPattern = ((raw: any): ConditionalInstallPattern => ({
  dependencies: transformCompositeDependency(raw.dependencies),
  files: transformFileList(raw.files)
}));

const transformConditionalFileInstallList
  = ((raw: any): ConditionalFileInstallList => ({patterns: {patterns: toArray(raw.patterns?.pattern).map(transformConditionalInstallPattern)}}));

const transformModuleConfiguration = ((raw: any): ModuleConfiguration => ({
  moduleName: transformModuleTitle(raw.moduleName),
  moduleImage: (raw.moduleImage ? transformHeaderImage(raw.moduleImage) : undefined),
  moduleDependencies: (raw.moduleDependencies ? transformCompositeDependency(raw.moduleDependencies) : undefined),
  requiredInstallFiles: (raw.requiredInstallFiles ? transformFileList(raw.requiredInstallFiles) : undefined),
  installSteps: (raw.installSteps ? transformStepList(raw.installSteps) : undefined),
  conditionalFileInstalls: (raw.conditionalFileInstalls ? transformConditionalFileInstallList(raw.conditionalFileInstalls) : undefined)
}));

export {
  transformHeaderImage,
  transformModuleTitle,
  transformConditionalInstallPattern,
  transformConditionalFileInstallList,
  transformModuleConfiguration
};
