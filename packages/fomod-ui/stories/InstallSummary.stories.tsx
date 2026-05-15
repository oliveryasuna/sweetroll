import type {Meta, StoryObj} from '@storybook/react';
import type {FileSystemItem} from '@sweetroll/fomod';
import {InstallSummary} from '../src/components/InstallSummary';

const file = ((source: string, destination?: string, overrides?: Partial<FileSystemItem>): FileSystemItem => ({
  source: source,
  destination: destination,
  alwaysInstall: false,
  installIfUsable: false,
  priority: 0,
  ...overrides
}));

const meta = ({
  title: 'Components/InstallSummary',
  component: InstallSummary,
  args: {
    files: [
      file('textures/architecture/wall01.dds', 'Data/textures/architecture/wall01.dds'),
      file('textures/architecture/wall01_n.dds', 'Data/textures/architecture/wall01_n.dds'),
      file('meshes/architecture/wall01.nif', 'Data/meshes/architecture/wall01.nif')
    ],
    onConfirm: (() => {
      // NO-OP
    }),
    onCancel: (() => {
      // NO-OP
    })
  }
} satisfies Meta<typeof InstallSummary>);

type Story = StoryObj<typeof meta>;

const Default: Story = {};

const ManyFiles: Story = {
  args: {
    files: [
      file('textures/landscape/dirt01.dds', 'Data/textures/landscape/dirt01.dds'),
      file('textures/landscape/dirt01_n.dds', 'Data/textures/landscape/dirt01_n.dds'),
      file('textures/landscape/grass01.dds', 'Data/textures/landscape/grass01.dds'),
      file('textures/landscape/grass01_n.dds', 'Data/textures/landscape/grass01_n.dds'),
      file('textures/landscape/rock01.dds', 'Data/textures/landscape/rock01.dds'),
      file('textures/landscape/rock01_n.dds', 'Data/textures/landscape/rock01_n.dds'),
      file('textures/landscape/snow01.dds', 'Data/textures/landscape/snow01.dds'),
      file('textures/landscape/snow01_n.dds', 'Data/textures/landscape/snow01_n.dds'),
      file('meshes/landscape/treepine01.nif', 'Data/meshes/landscape/treepine01.nif'),
      file('meshes/landscape/treepine02.nif', 'Data/meshes/landscape/treepine02.nif')
    ]
  }
};

const NoDestination: Story = {
  args: {
    files: [
      file('plugin.esp'),
      file('scripts/main.pex'),
      file('interface/config.xml')
    ]
  }
};

const EmptyFileList: Story = {args: {files: []}};

const FoldersAndFiles: Story = {
  args: {
    files: [
      file('textures/', 'Data/textures/', {alwaysInstall: true}),
      file('meshes/', 'Data/meshes/', {alwaysInstall: true}),
      file('plugin.esp', 'Data/plugin.esp', {priority: 1})
    ]
  }
};

export default meta;
export {
  Default,
  EmptyFileList,
  FoldersAndFiles,
  ManyFiles,
  NoDestination
};
