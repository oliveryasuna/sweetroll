import type {Meta, StoryObj} from '@storybook/react';
import {Plugin} from '../src/components/Plugin';

const meta = ({
  title: 'Components/Plugin',
  component: Plugin,
  args: {
    plugin: {
      name: 'High Resolution Textures',
      description: 'Replaces default textures with 4K variants.',
      typeDescriptor: {type: {name: 'Optional'}}
    },
    resolvedType: 'Optional',
    selected: false,
    disabled: false,
    onSelect: (() => {
      // NO-OP
    }),
    onDeselect: (() => {
      // NO-OP
    }),
    onFocus: (() => {
      // NO-OP
    })
  }
} satisfies Meta<typeof Plugin>);

type Story = StoryObj<typeof meta>;

const Default: Story = {};

const Selected: Story = {args: {selected: true}};

const Required: Story = {args: {resolvedType: 'Required'}};

const Recommended: Story = {args: {resolvedType: 'Recommended'}};

const NotUsable: Story = {args: {resolvedType: 'NotUsable'}};

const CouldBeUsable: Story = {args: {resolvedType: 'CouldBeUsable'}};

const Disabled: Story = {args: {disabled: true}};

const WithImage: Story = {
  args: {
    plugin: {
      name: 'Enhanced Blood Textures',
      description: 'More realistic blood splatters and pools.',
      image: {path: 'https://placehold.co/200x150'},
      typeDescriptor: {type: {name: 'Optional'}}
    }
  }
};

export default meta;
export {
  CouldBeUsable,
  Default,
  Disabled,
  NotUsable,
  Recommended,
  Required,
  Selected,
  WithImage
};
