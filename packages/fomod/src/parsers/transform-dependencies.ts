/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type {
  CompositeDependency,
  DependencyType,
  DependencyPattern,
  DependencyPluginType,
  FileDependency,
  FlagDependency,
  PluginType,
  PluginTypeDescriptor,
  VersionDependency
} from '../schemas';
import {toArray} from './xml-utils';

const transformVersionDependency = ((raw: any): VersionDependency => ({version: raw['@_version']}));

const transformFileDependency = ((raw: any): FileDependency => ({
  file: raw['@_file'],
  state: raw['@_state']
}));

const transformFlagDependency = ((raw: any): FlagDependency => ({
  flag: raw['@_flag'],
  value: raw['@_value']
}));

const transformDependencyType = ((elementName: string, raw: any): DependencyType => {
  switch(elementName) {
    case 'fileDependency': {
      return {
        type: 'fileDependency',
        value: transformFileDependency(raw)
      };
    }
    case 'flagDependency': {
      return {
        type: 'flagDependency',
        value: transformFlagDependency(raw)
      };
    }
    case 'gameDependency': {
      return {
        type: 'gameDependency',
        value: transformVersionDependency(raw)
      };
    }
    case 'fommDependency': {
      return {
        type: 'fommDependency',
        value: transformVersionDependency(raw)
      };
    }
    case 'dependencies': {
      return {
        type: 'dependencies',
        value: transformCompositeDependency(raw)
      };
    }
    default: {
      throw (new Error(`Unknown dependency element: ${elementName}`));
    }
  }
});

const DEPENDENCY_KEYS = (['fileDependency', 'flagDependency', 'gameDependency', 'fommDependency', 'dependencies'] as const);

const transformCompositeDependency = ((raw: any): CompositeDependency => {
  const items: DependencyType[] = [];
  for(const key of DEPENDENCY_KEYS) {
    for(const child of toArray(raw[key])) {
      items.push(transformDependencyType(key, child));
    }
  }
  return {
    operator: (raw['@_operator'] ?? 'And'),
    items: items
  };
});

const transformPluginType = ((raw: any): PluginType => ({name: raw['@_name']}));

const transformDependencyPattern = ((raw: any): DependencyPattern => ({
  dependencies: transformCompositeDependency(raw.dependencies),
  type: transformPluginType(raw.type)
}));

const transformDependencyPluginType = ((raw: any): DependencyPluginType => ({
  defaultType: transformPluginType(raw.defaultType),
  patterns: {patterns: toArray(raw.patterns?.pattern).map(transformDependencyPattern)}
}));

const transformPluginTypeDescriptor = ((raw: any): PluginTypeDescriptor => {
  if(raw.dependencyType) {
    return {dependencyType: transformDependencyPluginType(raw.dependencyType)};
  }
  return {type: transformPluginType(raw.type)};
});

export {
  transformVersionDependency,
  transformFileDependency,
  transformFlagDependency,
  transformCompositeDependency,
  transformPluginType,
  transformDependencyPattern,
  transformDependencyPluginType,
  transformPluginTypeDescriptor
};
