import type {InstallSummaryProps} from './InstallSummary.props';

const InstallSummary = ((
  {
    files,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onConfirm,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onCancel
  }: InstallSummaryProps
) => (
  <section data-install-summary="">
    <h2>Files to install</h2>
    <ul>
      {files.map(file => (
        <li key={`${file.source}:${file.destination ?? ''}`}>
          <span data-source="">{file.source}</span>
          {file.destination && (
            <span data-destination="">{file.destination}</span>
          )}
        </li>
      ))}
    </ul>
    <div>
      <button type="button" onClick={onCancel}>Cancel</button>
      <button type="button" onClick={onConfirm}>Confirm</button>
    </div>
  </section>
));

export {
  InstallSummary
};
