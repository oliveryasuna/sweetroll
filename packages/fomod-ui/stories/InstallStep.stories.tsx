import type {Meta, StoryObj} from '@storybook/react';
import {InstallStep} from '../src/components/InstallStep';

const meta = ({
  title: 'Components/InstallStep',
  component: InstallStep,
  args: {
    step: {
      name: 'Choose Texture Quality',
      optionalFileGroups: {
        groups: [
          {
            name: 'Resolution',
            type: 'SelectExactlyOne',
            plugins: {
              plugins: [
                {
                  name: '1K Textures',
                  description: 'Low resolution for performance.',
                  typeDescriptor: {type: {name: 'Optional'}}
                },
                {
                  name: '2K Textures',
                  description: 'Balanced quality and performance.',
                  typeDescriptor: {type: {name: 'Recommended'}}
                },
                {
                  name: '4K Textures',
                  description: 'Maximum quality. Requires 8GB+ VRAM.',
                  typeDescriptor: {type: {name: 'Optional'}}
                }
              ],
              order: 'Explicit'
            }
          },
          {
            name: 'Extras',
            type: 'SelectAny',
            plugins: {
              plugins: [
                {
                  name: 'Parallax Maps',
                  description: 'Adds depth to surfaces.',
                  typeDescriptor: {type: {name: 'Optional'}}
                },
                {
                  name: 'Enhanced Normal Maps',
                  description: 'Improved surface detail.',
                  typeDescriptor: {type: {name: 'Optional'}}
                }
              ],
              order: 'Explicit'
            }
          }
        ],
        order: 'Explicit'
      }
    },
    stepIndex: 0,
    selections: {},
    resolvedTypes: {
      0: ['Optional', 'Recommended', 'Optional'],
      1: ['Optional', 'Optional']
    },
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
} satisfies Meta<typeof InstallStep>);

type Story = StoryObj<typeof meta>;

const Default: Story = {};

const WithSelections: Story = {
  args: {
    selections: {
      0: (new Set([1])),
      1: (new Set([0, 1]))
    }
  }
};

const SingleGroup: Story = {
  args: {
    step: {
      name: 'Choose Installation Type',
      optionalFileGroups: {
        groups: [
          {
            name: 'Installation Type',
            type: 'SelectExactlyOne',
            plugins: {
              plugins: [
                {
                  name: 'Full Installation',
                  description: 'Installs all components.',
                  typeDescriptor: {type: {name: 'Optional'}}
                },
                {
                  name: 'Lite Installation',
                  description: 'Installs only essential components.',
                  typeDescriptor: {type: {name: 'Optional'}}
                },
                {
                  name: 'Custom Installation',
                  description: 'Choose individual components.',
                  typeDescriptor: {type: {name: 'Optional'}}
                }
              ],
              order: 'Explicit'
            }
          }
        ],
        order: 'Explicit'
      }
    },
    resolvedTypes: {0: ['Optional', 'Optional', 'Optional']}
  }
};

export default meta;
export {
  Default,
  SingleGroup,
  WithSelections
};
