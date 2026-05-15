import type {Plugin} from '@sweetroll/fomod';
import {useMemo, useState} from 'react';

import {useFomodState} from '../../hooks/use-fomod-state';
import {usePluginType} from '../../hooks/use-plugin-type';
import {InstallerHeader} from '../InstallerHeader';
import {InstallStep} from '../InstallStep';
import {InstallSummary} from '../InstallSummary';
import {PluginDetail} from '../PluginDetail';
import {StepNavigator} from '../StepNavigator';
import {StepProgress} from '../StepProgress';
import type {FomodInstallerProps} from './FomodInstaller.props';

// eslint-disable-next-line max-lines-per-function
const FomodInstaller = ((
  {
    config,
    fileStates = {},
    gameVersion,
    fommVersion,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onInstall,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onCancel: _onCancel
  }: FomodInstallerProps
) => {
  const [showSummary, setShowSummary] = useState(false);
  const [focusedPlugin, setFocusedPlugin] = useState<Plugin | undefined>();

  const context = useMemo(
    (() => ({
      fileStates: fileStates,
      gameVersion: gameVersion,
      fommVersion: fommVersion
    })),
    [fileStates, gameVersion, fommVersion]
  );

  const state = useFomodState(config, context);
  const resolvePluginType = usePluginType({
    ...context,
    flags: state.flags
  });

  const currentStep = state.visibleSteps[state.currentStepIndex];

  const resolvedTypes = useMemo((() => {
    if(!currentStep) {
      return {};
    }

    const result: Record<number, string[]> = {};

    for(const [groupIndex, group] of currentStep.optionalFileGroups.groups.entries()) {
      result[groupIndex] = group.plugins.plugins.map(plugin => resolvePluginType(plugin.typeDescriptor));
    }

    return result;
  }), [currentStep, resolvePluginType]);

  const handleFocusPlugin = ((groupIndex: number, pluginIndex: number): void => {
    const plugin = currentStep?.optionalFileGroups.groups[groupIndex]?.plugins.plugins[pluginIndex];

    setFocusedPlugin(plugin);
  });

  const handleInstall = ((): void => {
    setShowSummary(true);
  });

  const handleConfirm = ((): void => {
    onInstall(state.getResolvedFiles());
  });

  const handleCancelSummary = ((): void => {
    setShowSummary(false);
  });

  if(showSummary) {
    return (
      <div data-fomod-installer="">
        <InstallerHeader image={config.moduleImage} title={config.moduleName} />
        <InstallSummary
          files={state.getResolvedFiles()}
          onCancel={handleCancelSummary}
          onConfirm={handleConfirm}
        />
      </div>
    );
  }

  return (
    <div data-fomod-installer="">
      <InstallerHeader image={config.moduleImage} title={config.moduleName} />
      <StepProgress currentStepIndex={state.currentStepIndex} steps={state.visibleSteps} />
      {currentStep && (
        <div data-installer-content="">
          <InstallStep
            resolvedTypes={resolvedTypes}
            selections={state.selections[state.currentStepIndex] ?? {}}
            step={currentStep}
            stepIndex={state.currentStepIndex}
            onDeselectPlugin={(groupIndex, pluginIndex) => {
              state.deselectPlugin(state.currentStepIndex, groupIndex, pluginIndex);
            }}
            onFocusPlugin={handleFocusPlugin}
            onSelectPlugin={(groupIndex, pluginIndex) => {
              state.selectPlugin(state.currentStepIndex, groupIndex, pluginIndex);
            }}
          />
          <PluginDetail plugin={focusedPlugin} />
        </div>
      )}
      <StepNavigator
        canGoBack={state.canGoBack}
        canGoForward={state.canGoForward}
        isComplete={state.isComplete}
        onBack={state.goToPreviousStep}
        onInstall={handleInstall}
        onNext={state.goToNextStep}
      />
    </div>
  );
});

export {
  FomodInstaller
};
