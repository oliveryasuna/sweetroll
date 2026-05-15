import type {PluginTypeDescriptor, PluginTypeEnum} from '@sweetroll/fomod';
import {useCallback} from 'react';

import type {DependencyContext} from './use-dependency-resolver';
import {evaluateCompositeDependency} from './use-dependency-resolver';

type PluginTypeResolver = (descriptor: PluginTypeDescriptor) => PluginTypeEnum;

const usePluginType = ((context: DependencyContext): PluginTypeResolver => {
  const resolve = useCallback(
    ((descriptor: PluginTypeDescriptor): PluginTypeEnum => {
      if(descriptor.type) {
        return descriptor.type.name;
      }

      const {defaultType, patterns} = descriptor.dependencyType;

      for(const pattern of patterns.patterns) {
        if(evaluateCompositeDependency((pattern.dependencies), context)) {
          return pattern.type.name;
        }
      }

      return defaultType.name;
    }),
    [context]
  );

  return resolve;
});

export type {
  PluginTypeResolver
};
export {
  usePluginType
};
