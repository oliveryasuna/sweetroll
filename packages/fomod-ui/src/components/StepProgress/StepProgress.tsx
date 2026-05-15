import type {StepProgressProps} from './StepProgress.props';

const StepProgress = (({steps, currentStepIndex}: StepProgressProps) => (
  <ol data-step-progress="">
    {steps.map((step, index) => (
      <li
        data-active={index === currentStepIndex}
        data-completed={index < currentStepIndex}
        key={step.name}
      >
        {step.name}
      </li>
    ))}
  </ol>
));

export {
  StepProgress
};
