import type {StepNavigatorProps} from './StepNavigator.props';

const StepNavigator = ((
  {
    canGoBack,
    canGoForward,
    isComplete,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onBack,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onNext,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onInstall
  }: StepNavigatorProps
) => (
  <nav data-step-navigator="">
    <button
      disabled={!canGoBack}
      type="button"
      onClick={onBack}
    >
      Back
    </button>
    {isComplete
      ? (
          <button
            type="button"
            onClick={onInstall}
          >
            Install
          </button>
        )
      : (
          <button
            disabled={!canGoForward}
            type="button"
            onClick={onNext}
          >
            Next
          </button>
        )}
  </nav>
));

export {
  StepNavigator
};
