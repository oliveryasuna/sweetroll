import type {Meta, StoryObj} from '@storybook/react';
import {StepProgress} from '../src/components/StepProgress';

const threeSteps = [
  {
    name: 'Choose Textures',
    optionalFileGroups: {
      groups: [],
      order: ('Explicit' as const)
    }
  },
  {
    name: 'Choose Audio',
    optionalFileGroups: {
      groups: [],
      order: ('Explicit' as const)
    }
  },
  {
    name: 'Compatibility Patches',
    optionalFileGroups: {
      groups: [],
      order: ('Explicit' as const)
    }
  }
];

const meta = ({
  title: 'Components/StepProgress',
  component: StepProgress,
  args: {
    steps: threeSteps,
    currentStepIndex: 0
  }
} satisfies Meta<typeof StepProgress>);

type Story = StoryObj<typeof meta>;

const FirstStep: Story = {args: {currentStepIndex: 0}};

const MiddleStep: Story = {args: {currentStepIndex: 1}};

const LastStep: Story = {args: {currentStepIndex: 2}};

const ManySteps: Story = {
  args: {
    steps: [
      {
        name: 'Core Files',
        optionalFileGroups: {
          groups: [],
          order: ('Explicit' as const)
        }
      },
      {
        name: 'Textures',
        optionalFileGroups: {
          groups: [],
          order: ('Explicit' as const)
        }
      },
      {
        name: 'Meshes',
        optionalFileGroups: {
          groups: [],
          order: ('Explicit' as const)
        }
      },
      {
        name: 'Audio',
        optionalFileGroups: {
          groups: [],
          order: ('Explicit' as const)
        }
      },
      {
        name: 'Compatibility',
        optionalFileGroups: {
          groups: [],
          order: ('Explicit' as const)
        }
      },
      {
        name: 'Final Options',
        optionalFileGroups: {
          groups: [],
          order: ('Explicit' as const)
        }
      }
    ],
    currentStepIndex: 3
  }
};

const SingleStep: Story = {
  args: {
    steps: [{
      name: 'Installation Options',
      optionalFileGroups: {
        groups: [],
        order: ('Explicit' as const)
      }
    }],
    currentStepIndex: 0
  }
};

export default meta;
export {
  FirstStep,
  LastStep,
  ManySteps,
  MiddleStep,
  SingleStep
};
