import type {Meta, StoryObj} from '@storybook/react';
import {PluginImage} from '../src/components/PluginImage';

const meta = ({
  title: 'Components/PluginImage',
  component: PluginImage,
  args: {
    path: 'https://placehold.co/400x300',
    alt: 'Plugin preview'
  }
} satisfies Meta<typeof PluginImage>);

type Story = StoryObj<typeof meta>;

const Default: Story = {};

const WithAlt: Story = {
  args: {
    path: 'https://placehold.co/600x400',
    alt: 'High resolution texture preview'
  }
};

const NoAlt: Story = {args: {alt: undefined}};

export default meta;
export {
  Default,
  NoAlt,
  WithAlt
};
