import {Plugin} from '../Plugin';
import type {GroupProps} from './Group.props';

const Group = ((
  {
    group,
    selectedIndices,
    resolvedTypes,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onSelectPlugin,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onDeselectPlugin,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onFocusPlugin
  }: GroupProps
) => {
  const isAllSelected = (group.type === 'SelectAll');

  return (
    <fieldset data-group="" data-group-type={group.type}>
      <legend>{group.name}</legend>
      {group.plugins.plugins.map((plugin, index) => (
        <Plugin
          disabled={isAllSelected}
          key={plugin.name}
          plugin={plugin}
          resolvedType={resolvedTypes[index] ?? 'Optional'}
          selected={isAllSelected || selectedIndices.has(index)}
          onDeselect={() => {
            onDeselectPlugin(index);
          }}
          onFocus={() => {
            onFocusPlugin(index);
          }}
          onSelect={() => {
            onSelectPlugin(index);
          }}
        />
      ))}
    </fieldset>
  );
});

export {
  Group
};
