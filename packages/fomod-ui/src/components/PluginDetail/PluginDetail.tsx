import {PluginImage} from '../PluginImage';
import type {PluginDetailProps} from './PluginDetail.props';

const PluginDetail = (({plugin}: PluginDetailProps) => {
  if(!plugin) {
    return null;
  }

  return (
    <div data-plugin-detail="">
      {plugin.image && (
        <PluginImage alt={plugin.name} path={plugin.image.path} />
      )}
      <p>{plugin.description}</p>
    </div>
  );
});

export {
  PluginDetail
};
