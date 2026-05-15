import type {Plugin as PluginSchema, PluginTypeEnum} from '@sweetroll/fomod';

interface PluginProps {
  plugin: PluginSchema;
  resolvedType: PluginTypeEnum;
  selected: boolean;
  disabled: boolean;
  onSelect(): void;
  onDeselect(): void;
  onFocus(): void;
}

export type {
  PluginProps
};
