/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {ConditionFlagList, FileList, FileSystemItem, SetConditionFlag} from '../schemas';
import {toArray, parseBool, parseIntVal, textContent} from './xml-utils';

const transformFileSystemItem = ((raw: any): FileSystemItem => ({
  source: raw['@_source'],
  destination: (raw['@_destination'] ?? undefined),
  alwaysInstall: parseBool(raw['@_alwaysInstall'], false),
  installIfUsable: parseBool(raw['@_installIfUsable'], false),
  priority: parseIntVal(raw['@_priority'], 0)
}));

const transformFileList = ((raw: any): FileList => ({
  files: toArray(raw.file).map(transformFileSystemItem),
  folders: toArray(raw.folder).map(transformFileSystemItem)
}));

const transformSetConditionFlag = ((raw: any): SetConditionFlag => ({
  name: raw['@_name'],
  value: textContent(raw)
}));

const transformConditionFlagList = ((raw: any): ConditionFlagList => ({flags: toArray(raw.flag).map(transformSetConditionFlag)}));

export {
  transformFileSystemItem,
  transformFileList,
  transformSetConditionFlag,
  transformConditionFlagList
};
