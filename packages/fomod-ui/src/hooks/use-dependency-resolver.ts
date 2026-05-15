import type {CompositeDependency, DependencyType, FileDependencyState} from '@sweetroll/fomod';
import {useCallback} from 'react';

interface DependencyContext {
  flags: Record<string, string>;
  fileStates: Record<string, FileDependencyState>;
  gameVersion?: string;
  fommVersion?: string;
}

const compareVersions = ((a: string, b: string): number => {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  const length = Math.max(partsA.length, partsB.length);

  for(let i = 0; i < length; i++) {
    const partA = (partsA[i] ?? 0);
    const partB = (partsB[i] ?? 0);

    if(partA > partB) {
      return 1;
    }
    if(partA < partB) {
      return -1;
    }
  }

  return 0;
});

// eslint-disable-next-line @typescript-eslint/consistent-return
const evaluateDependencyItem = ((item: DependencyType, context: DependencyContext): boolean => {
  switch(item.type) {
    case 'fileDependency': {
      const actualState = (context.fileStates[item.value.file] ?? 'Missing');

      return (actualState === item.value.state);
    }
    case 'flagDependency': {
      const actualValue = (context.flags[item.value.flag] ?? '');

      return (actualValue === item.value.value);
    }
    case 'gameDependency': {
      if(!context.gameVersion) {
        return false;
      }

      return (compareVersions(context.gameVersion, item.value.version) >= 0);
    }
    case 'fommDependency': {
      if(!context.fommVersion) {
        return false;
      }

      return (compareVersions(context.fommVersion, item.value.version) >= 0);
    }
    case 'dependencies': {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return evaluateCompositeDependency(item.value, context);
    }
  }
});

const evaluateCompositeDependency = ((dependency: CompositeDependency, context: DependencyContext): boolean => {
  const {operator, items} = dependency;

  if(items.length === 0) {
    return true;
  }

  if(operator === 'And') {
    return items.every(item => evaluateDependencyItem(item, context));
  }

  return items.some(item => evaluateDependencyItem(item, context));
});

const useDependencyResolver = ((context: DependencyContext): ((dependency: (CompositeDependency | undefined)) => boolean) => {
  const resolve = useCallback(
    ((dependency: CompositeDependency | undefined): boolean => {
      if(!dependency) {
        return true;
      }

      return evaluateCompositeDependency(dependency, context);
    }),
    [context]
  );

  return resolve;
});

export type {
  DependencyContext
};
export {
  evaluateCompositeDependency, useDependencyResolver
};
