import type {FileList, FileSystemItem, InstallStep, ModuleConfiguration, Plugin} from '@sweetroll/fomod';
import {useCallback, useMemo, useState} from 'react';

import type {DependencyContext} from './use-dependency-resolver';
import {evaluateCompositeDependency} from './use-dependency-resolver';

type FomodSelections = Record<number, Record<number, Set<number>>>;

interface FomodState {
  currentStepIndex: number;
  selections: FomodSelections;
  flags: Record<string, string>;
  visibleSteps: InstallStep[];
  canGoBack: boolean;
  canGoForward: boolean;
  isComplete: boolean;
  selectPlugin(stepIndex: number, groupIndex: number, pluginIndex: number): void;
  deselectPlugin(stepIndex: number, groupIndex: number, pluginIndex: number): void;
  goToNextStep(): void;
  goToPreviousStep(): void;
  getResolvedFiles(): FileSystemItem[];
}

// eslint-disable-next-line max-statements, sonarjs/cognitive-complexity, complexity
const computeFlags = ((config: ModuleConfiguration, selections: FomodSelections): Record<string, string> => {
  const flags: Record<string, string> = {};
  const steps = (config.installSteps?.installSteps ?? []);

  for(const [stepIndexStr, groups] of Object.entries(selections)) {
    const stepIndex = Number(stepIndexStr);
    const step = steps[stepIndex];

    if(!step) {
      continue;
    }

    for(const [groupIndexStr, pluginIndices] of Object.entries(groups)) {
      const groupIndex = Number(groupIndexStr);
      const group = step.optionalFileGroups.groups[groupIndex];

      if(!group) {
        continue;
      }

      for(const pluginIndex of pluginIndices) {
        const plugin: Plugin | undefined = group.plugins.plugins[pluginIndex];

        if(plugin?.conditionFlags) {
          // eslint-disable-next-line max-depth
          for(const flag of plugin.conditionFlags.flags) {
            flags[flag.name] = flag.value;
          }
        }
      }
    }
  }

  return flags;
});

const collectFilesFromFileList = ((fileList: FileList | undefined, result: FileSystemItem[]): void => {
  if(!fileList) {
    return;
  }

  result.push(...fileList.files, ...fileList.folders);
});

// eslint-disable-next-line max-lines-per-function
const useFomodState = ((config: ModuleConfiguration, context: Omit<DependencyContext, 'flags'>): FomodState => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState<FomodSelections>({});

  const flags = useMemo(
    (() => computeFlags(config, selections)),
    [config, selections]
  );

  const dependencyContext: DependencyContext = useMemo(
    (() => ({
      ...context,
      flags: flags
    })),
    [context, flags]
  );

  const visibleSteps = useMemo(((): InstallStep[] => {
    const steps = (config.installSteps?.installSteps ?? []);

    return steps.filter((step) => {
      if(!step.visible) {
        return true;
      }

      return evaluateCompositeDependency(step.visible, dependencyContext);
    });
  }), [config, dependencyContext]);

  const canGoBack = (currentStepIndex > 0);
  const canGoForward = (currentStepIndex < (visibleSteps.length - 1));
  const isComplete = (currentStepIndex === (visibleSteps.length - 1));

  const selectPlugin = useCallback(((stepIndex: number, groupIndex: number, pluginIndex: number): void => {
    setSelections((prev) => {
      const step = config.installSteps?.installSteps[stepIndex];
      const group = step?.optionalFileGroups.groups[groupIndex];

      if(!group) {
        return prev;
      }

      const next = {...prev};
      const stepSelections = {...next[stepIndex]};
      let groupSelections = (new Set(stepSelections[groupIndex]));

      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch(group.type) {
        case 'SelectExactlyOne':
        case 'SelectAtMostOne': {
          groupSelections = (new Set([pluginIndex]));
          break;
        }
        default: {
          groupSelections.add(pluginIndex);
          break;
        }
      }

      stepSelections[groupIndex] = groupSelections;
      next[stepIndex] = stepSelections;

      return next;
    });
  }), [config]);

  const deselectPlugin = useCallback(((stepIndex: number, groupIndex: number, pluginIndex: number): void => {
    setSelections((prev) => {
      const next = {...prev};
      const stepSelections = {...next[stepIndex]};
      const groupSelections = (new Set(stepSelections[groupIndex]));

      groupSelections.delete(pluginIndex);
      stepSelections[groupIndex] = groupSelections;
      next[stepIndex] = stepSelections;

      return next;
    });
  }), []);

  const goToNextStep = useCallback(((): void => {
    if(canGoForward) {
      setCurrentStepIndex(prev => (prev + 1));
    }
  }), [canGoForward]);

  const goToPreviousStep = useCallback(((): void => {
    if(canGoBack) {
      setCurrentStepIndex(prev => (prev - 1));
    }
  }), [canGoBack]);

  // eslint-disable-next-line max-statements, sonarjs/cognitive-complexity, complexity
  const getResolvedFiles = useCallback(((): FileSystemItem[] => {
    const result: FileSystemItem[] = [];

    collectFilesFromFileList(config.requiredInstallFiles, result);

    for(const [stepIndexStr, groups] of Object.entries(selections)) {
      const stepIndex = Number(stepIndexStr);
      const step = config.installSteps?.installSteps[stepIndex];

      if(!step) {
        continue;
      }

      for(const [groupIndexStr, pluginIndices] of Object.entries(groups)) {
        const groupIndex = Number(groupIndexStr);
        const group = step.optionalFileGroups.groups[groupIndex];

        if(!group) {
          continue;
        }

        for(const pluginIndex of pluginIndices) {
          const plugin: Plugin | undefined = group.plugins.plugins[pluginIndex];

          if(plugin) {
            collectFilesFromFileList(plugin.files, result);
          }
        }
      }
    }

    if(config.conditionalFileInstalls) {
      for(const pattern of config.conditionalFileInstalls.patterns.patterns) {
        if(evaluateCompositeDependency(pattern.dependencies, dependencyContext)) {
          collectFilesFromFileList(pattern.files, result);
        }
      }
    }

    return result;
  }), [config, selections, dependencyContext]);

  return {
    currentStepIndex: currentStepIndex,
    selections: selections,
    flags: flags,
    visibleSteps: visibleSteps,
    canGoBack: canGoBack,
    canGoForward: canGoForward,
    isComplete: isComplete,
    selectPlugin: selectPlugin,
    deselectPlugin: deselectPlugin,
    goToNextStep: goToNextStep,
    goToPreviousStep: goToPreviousStep,
    getResolvedFiles: getResolvedFiles
  };
});

export type {
  FomodSelections,
  FomodState
};
export {
  useFomodState
};
