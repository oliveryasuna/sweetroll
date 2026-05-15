import type {Meta, StoryObj} from '@storybook/react';
import {InstallerHeader} from '../src/components/InstallerHeader';

const meta = ({
  title: 'Components/InstallerHeader',
  component: InstallerHeader,
  args: {
    title: {
      value: 'Enhanced Textures Pack',
      position: 'Left',
      colour: '000000'
    }
  }
} satisfies Meta<typeof InstallerHeader>);

type Story = StoryObj<typeof meta>;

const Default: Story = {};

const WithImage: Story = {
  args: {
    title: {
      value: 'Skyrim HD Overhaul',
      position: 'RightOfImage',
      colour: '2a4d8f'
    },
    image: {
      path: 'https://placehold.co/800x120',
      showImage: true,
      showFade: true,
      height: -1
    }
  }
};

const CustomColour: Story = {
  args: {
    title: {
      value: 'Dark Theme Mod',
      position: 'Left',
      colour: 'cc3333'
    }
  }
};

const RightPosition: Story = {
  args: {
    title: {
      value: 'Right-Aligned Title',
      position: 'Right',
      colour: '006600'
    }
  }
};

const WithFixedHeightImage: Story = {
  args: {
    title: {
      value: 'Fixed Height Header',
      position: 'Left',
      colour: '000000'
    },
    image: {
      path: 'https://placehold.co/800x200',
      showImage: true,
      showFade: false,
      height: 80
    }
  }
};

const HiddenImage: Story = {
  args: {
    title: {
      value: 'Image Hidden',
      position: 'Left',
      colour: '000000'
    },
    image: {
      path: 'https://placehold.co/800x120',
      showImage: false,
      showFade: true,
      height: -1
    }
  }
};

export default meta;
export {
  CustomColour,
  Default,
  HiddenImage,
  RightPosition,
  WithFixedHeightImage,
  WithImage
};
