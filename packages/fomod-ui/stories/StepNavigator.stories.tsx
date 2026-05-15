import type {Meta, StoryObj} from '@storybook/react';
import {StepNavigator} from '../src/components/StepNavigator';

const meta = ({
  title: 'Components/StepNavigator',
  component: StepNavigator,
  args: {
    canGoBack: true,
    canGoForward: true,
    isComplete: false,
    onBack: (() => {
      // NO-OP
    }),
    onNext: (() => {
      // NO-OP
    }),
    onInstall: (() => {
      // NO-OP
    })
  }
} satisfies Meta<typeof StepNavigator>);

type Story = StoryObj<typeof meta>;

const Default: Story = {};

const FirstStep: Story = {
  args: {
    canGoBack: false,
    canGoForward: true,
    isComplete: false
  }
};

const MiddleStep: Story = {
  args: {
    canGoBack: true,
    canGoForward: true,
    isComplete: false
  }
};

const LastStep: Story = {
  args: {
    canGoBack: true,
    canGoForward: false,
    isComplete: true
  }
};

const SingleStep: Story = {
  args: {
    canGoBack: false,
    canGoForward: false,
    isComplete: true
  }
};

export default meta;
export {
  Default,
  FirstStep,
  LastStep,
  MiddleStep,
  SingleStep
};
