import type {InstallStep} from '@sweetroll/fomod';

interface StepProgressProps {
  steps: InstallStep[];
  currentStepIndex: number;
}

export type {
  StepProgressProps
};
