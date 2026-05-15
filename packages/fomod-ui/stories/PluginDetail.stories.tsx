import type {Meta, StoryObj} from '@storybook/react';
import {PluginDetail} from '../src/components/PluginDetail';

const meta = ({
  title: 'Components/PluginDetail',
  component: PluginDetail,
  args: {
    plugin: {
      name: 'High Resolution Textures',
      description: 'This option replaces all default textures with high-resolution 4K alternatives. Recommended for systems with 8GB+ VRAM.',
      image: {path: 'https://placehold.co/400x300'},
      typeDescriptor: {type: {name: 'Optional'}}
    }
  }
} satisfies Meta<typeof PluginDetail>);

type Story = StoryObj<typeof meta>;

const Default: Story = {};

const NoImage: Story = {
  args: {
    plugin: {
      name: 'Performance Mode',
      description: 'Reduces texture resolution and disables some effects for better performance on lower-end hardware.',
      typeDescriptor: {type: {name: 'Optional'}}
    }
  }
};

const LongDescription: Story = {
  args: {
    plugin: {
      name: 'Complete Overhaul',
      // eslint-disable-next-line @stylistic/max-len
      description: 'This is a comprehensive overhaul that touches nearly every visual aspect of the game. It includes new meshes, textures, normal maps, and specular maps for all architecture, landscape, flora, and fauna. Installation may take several minutes depending on your system. Please ensure you have at least 10GB of free disk space before proceeding. This option is incompatible with other texture replacers.',
      image: {path: 'https://placehold.co/400x300'},
      typeDescriptor: {type: {name: 'Recommended'}}
    }
  }
};

const NoPlugin: Story = {args: {plugin: undefined}};

export default meta;
export {
  Default,
  LongDescription,
  NoImage,
  NoPlugin
};
