import type {PluginProps} from './Plugin.props';

// eslint-disable-next-line max-lines-per-function
const Plugin = ((
  {
    plugin,
    resolvedType,
    selected,
    disabled,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onSelect,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onDeselect,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onFocus
  }: PluginProps
) => {
  const isForced = (resolvedType === 'Required');
  const isBlocked = (resolvedType === 'NotUsable');
  const isDisabled = (disabled || isForced || isBlocked);
  const isChecked = (selected || isForced);

  const handleChange = ((): void => {
    if(isDisabled) {
      return;
    }

    if(isChecked) {
      onDeselect();
    } else {
      onSelect();
    }
  });

  return (
    <div
      data-plugin-type={resolvedType}
      data-selected={isChecked}
    >
      <label>
        <input
          checked={isChecked}
          disabled={isDisabled}
          name={plugin.name}
          type="checkbox"
          onChange={handleChange}
          onFocus={onFocus}
        />
        <span>{plugin.name}</span>
      </label>
      {(resolvedType !== 'Optional') && (<span data-badge={resolvedType}>{resolvedType}</span>)}
    </div>
  );
});

export {
  Plugin
};
