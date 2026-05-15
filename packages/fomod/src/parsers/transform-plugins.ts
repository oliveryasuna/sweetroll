/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {Group, GroupList, Image, InstallStep, PluginList, Plugin, StepList} from '../schemas';
import {transformCompositeDependency, transformPluginTypeDescriptor} from './transform-dependencies';
import {transformFileList, transformConditionFlagList} from './transform-files';
import {toArray, textContent} from './xml-utils';

const transformImage = ((raw: any): Image => ({path: raw['@_path']}));

const transformPlugin = ((raw: any): Plugin => ({
  name: raw['@_name'],
  description: ((typeof raw.description === 'string') ? raw.description : textContent(raw.description)),
  image: (raw.image ? transformImage(raw.image) : undefined),
  files: (raw.files ? transformFileList(raw.files) : undefined),
  conditionFlags: (raw.conditionFlags ? transformConditionFlagList(raw.conditionFlags) : undefined),
  typeDescriptor: transformPluginTypeDescriptor(raw.typeDescriptor)
}));

const transformPluginList = ((raw: any): PluginList => ({
  plugins: toArray(raw.plugin).map(transformPlugin),
  order: (raw['@_order'] ?? 'Ascending')
}));

const transformGroup = ((raw: any): Group => ({
  name: raw['@_name'],
  type: raw['@_type'],
  plugins: transformPluginList(raw.plugins)
}));

const transformGroupList = ((raw: any): GroupList => ({
  groups: toArray(raw.group).map(transformGroup),
  order: (raw['@_order'] ?? 'Ascending')
}));

const transformInstallStep = ((raw: any): InstallStep => ({
  name: raw['@_name'],
  visible: (raw.visible ? transformCompositeDependency(raw.visible) : undefined),
  optionalFileGroups: transformGroupList(raw.optionalFileGroups)
}));

const transformStepList = ((raw: any): StepList => ({
  installSteps: toArray(raw.installStep).map(transformInstallStep),
  order: (raw['@_order'] ?? 'Ascending')
}));

export {
  transformImage,
  transformPlugin,
  transformPluginList,
  transformGroup,
  transformGroupList,
  transformInstallStep,
  transformStepList
};
