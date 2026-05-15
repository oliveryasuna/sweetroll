import {Group} from '../Group';
import type {InstallStepProps} from './InstallStep.props';

const InstallStep = ((
  {
    step,
    selections,
    resolvedTypes,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onSelectPlugin,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onDeselectPlugin,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onFocusPlugin
  }: InstallStepProps
) => (
  <section data-install-step="">
    <h2>{step.name}</h2>
    {step.optionalFileGroups.groups.map((group, groupIndex) => (
      <Group
        group={group}
        key={group.name}
        resolvedTypes={resolvedTypes[groupIndex] ?? []}
        selectedIndices={selections[groupIndex] ?? (new Set())}
        onDeselectPlugin={(pluginIndex) => {
          onDeselectPlugin(groupIndex, pluginIndex);
        }}
        onFocusPlugin={(pluginIndex) => {
          onFocusPlugin(groupIndex, pluginIndex);
        }}
        onSelectPlugin={(pluginIndex) => {
          onSelectPlugin(groupIndex, pluginIndex);
        }}
      />
    ))}
  </section>
));

export {
  InstallStep
};
