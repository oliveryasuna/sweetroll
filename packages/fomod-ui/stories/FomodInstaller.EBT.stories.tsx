import type {Meta, StoryObj} from '@storybook/react';
import {parseModuleConfig} from '@sweetroll/fomod';
import {FomodInstaller} from '../src/components/FomodInstaller';
// @ts-expect-error -- raw import
import moduleConfigXml from './__fixtures__/Enhanced Blood Textures/fomod/ModuleConfig.xml?raw';

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const config = parseModuleConfig(moduleConfigXml as string);

const meta = ({
  title: 'Real Mods/Enhanced Blood Textures',
  component: FomodInstaller,
  args: {
    config: config,
    onInstall: (() => {
      // NO-OP
    }),
    onCancel: (() => {
      // NO-OP
    })
  },
  parameters: {layout: 'fullscreen'}
} satisfies Meta<typeof FomodInstaller>);

type Story = StoryObj<typeof meta>;

const Default: Story = {};

const WithSPID: Story = {args: {fileStates: {'dD - Enhanced Blood Main.esp': 'Active'}}};

export default meta;
export {
  Default,
  WithSPID
};
