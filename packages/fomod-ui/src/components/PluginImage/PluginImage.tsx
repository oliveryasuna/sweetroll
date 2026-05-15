import type {PluginImageProps} from './PluginImage.props';

const PluginImage = (({path, alt}: PluginImageProps) => (
  <img
    alt={alt ?? ''}
    data-plugin-image=""
    src={path}
  />
));

export {
  PluginImage
};
