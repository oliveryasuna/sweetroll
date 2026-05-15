interface StepNavigatorProps {
  canGoBack: boolean;
  canGoForward: boolean;
  isComplete: boolean;
  onBack(): void;
  onNext(): void;
  onInstall(): void;
}

export type {
  StepNavigatorProps
};
