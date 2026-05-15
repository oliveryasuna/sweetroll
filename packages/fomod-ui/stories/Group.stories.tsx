import type {Meta, StoryObj} from '@storybook/react';
import {Group} from '../src/components/Group';

const basePlugins = {
  plugins: [
    {
      name: 'Option A - Realistic',
      description: 'Realistic style textures.',
      typeDescriptor: {type: {name: ('Optional' as const)}}
    },
    {
      name: 'Option B - Stylized',
      description: 'Stylized, painterly textures.',
      typeDescriptor: {type: {name: ('Optional' as const)}}
    },
    {
      name: 'Option C - Vanilla+',
      description: 'Subtle improvements over vanilla.',
      typeDescriptor: {type: {name: ('Optional' as const)}}
    }
  ],
  order: ('Explicit' as const)
};

const meta = ({
  title: 'Components/Group',
  component: Group,
  args: {
    group: {
      name: 'Texture Style',
      type: 'SelectExactlyOne',
      plugins: basePlugins
    },
    selectedIndices: (new Set<number>()),
    resolvedTypes: ['Optional', 'Optional', 'Optional'],
    onSelectPlugin: (() => {
      // NO-OP
    }),
    onDeselectPlugin: (() => {
      // NO-OP
    }),
    onFocusPlugin: (() => {
      // NO-OP
    })
  }
} satisfies Meta<typeof Group>);

type Story = StoryObj<typeof meta>;

const SelectExactlyOne: Story = {};

const SelectAtMostOne: Story = {
  args: {
    group: {
      name: 'Optional Enhancement',
      type: 'SelectAtMostOne',
      plugins: basePlugins
    }
  }
};

const SelectAtLeastOne: Story = {
  args: {
    group: {
      name: 'Required Patches',
      type: 'SelectAtLeastOne',
      plugins: basePlugins
    }
  }
};

const SelectAny: Story = {
  args: {
    group: {
      name: 'Compatibility Patches',
      type: 'SelectAny',
      plugins: basePlugins
    }
  }
};

const SelectAll: Story = {
  args: {
    group: {
      name: 'Core Files',
      type: 'SelectAll',
      plugins: basePlugins
    }
  }
};

const WithSelection: Story = {args: {selectedIndices: (new Set([1]))}};

const WithMixedTypes: Story = {
  args: {
    group: {
      name: 'Mixed Types Group',
      type: 'SelectAny',
      plugins: {
        plugins: [
          {
            name: 'Required Patch',
            description: 'This patch is required.',
            typeDescriptor: {type: {name: ('Required' as const)}}
          },
          {
            name: 'Recommended Option',
            description: 'This is recommended.',
            typeDescriptor: {type: {name: ('Recommended' as const)}}
          },
          {
            name: 'Optional Extra',
            description: 'Totally optional.',
            typeDescriptor: {type: {name: ('Optional' as const)}}
          },
          {
            name: 'Incompatible',
            description: 'Not usable with current setup.',
            typeDescriptor: {type: {name: ('NotUsable' as const)}}
          }
        ],
        order: ('Explicit' as const)
      }
    },
    resolvedTypes: ['Required', 'Recommended', 'Optional', 'NotUsable']
  }
};

export default meta;
export {
  SelectAll,
  SelectAny,
  SelectAtLeastOne,
  SelectAtMostOne,
  SelectExactlyOne,
  WithMixedTypes,
  WithSelection
};
