import type {InstallerHeaderProps} from './InstallerHeader.props';

const InstallerHeader = (({title, image}: InstallerHeaderProps) => (
  <header data-installer-header="" data-title-position={title.position}>
    {image?.showImage && image.path && (
      <img
        alt=""
        data-header-image=""
        src={image.path}
        style={(image.height > 0) ? {height: image.height} : undefined}
      />
    )}
    <h1 style={{color: `#${title.colour}`}}>{title.value}</h1>
  </header>
));

export {
  InstallerHeader
};
