import type {Group as GroupSchema, PluginTypeEnum} from '@sweetroll/fomod';

interface GroupProps {
  group: GroupSchema;
  selectedIndices: Set<number>;
  resolvedTypes: PluginTypeEnum[];
  onSelectPlugin(pluginIndex: number): void;
  onDeselectPlugin(pluginIndex: number): void;
  onFocusPlugin(pluginIndex: number): void;
}

export type {
  GroupProps
};
