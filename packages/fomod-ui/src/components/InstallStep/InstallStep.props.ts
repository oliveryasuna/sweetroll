import type {InstallStep as InstallStepSchema, PluginTypeEnum} from '@sweetroll/fomod';

interface InstallStepProps {
  step: InstallStepSchema;
  stepIndex: number;
  selections: Record<number, Set<number>>;
  resolvedTypes: Record<number, PluginTypeEnum[]>;
  onSelectPlugin(groupIndex: number, pluginIndex: number): void;
  onDeselectPlugin(groupIndex: number, pluginIndex: number): void;
  onFocusPlugin(groupIndex: number, pluginIndex: number): void;
}

export type {
  InstallStepProps
};
