import {XMLParser} from 'fast-xml-parser';
import type {Config} from '../schemas';
import {configSchema} from '../schemas';
import {transformModuleConfiguration} from './transform-module';

// Elements that must always be parsed as arrays even when there's only one child
const ARRAY_ELEMENTS = (new Set([
  'plugin',
  'group',
  'installStep',
  'file',
  'folder',
  'flag',
  'pattern',
  'fileDependency',
  'flagDependency'
]));

const parser = (new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  isArray: ((name: string, jpath: unknown, isLeaf: boolean, isAttribute: boolean): boolean => {
    if(isAttribute) {
      return false;
    }
    if(isLeaf) {
      return false;
    }
    // <dependencies> nested inside another <dependencies> (dependencyTypesGroup
    // recursive case) must be an array.
    // Top-level <dependencies> (compositeDependency) must stay an object.
    if(name === 'dependencies') {
      const jpathStr = String(jpath);
      const parts = jpathStr.split('.');
      return (parts.filter((p: string) => (p === 'dependencies')).length > 1);
    }
    return ARRAY_ELEMENTS.has(name);
  }),
  parseAttributeValue: false,
  parseTagValue: false,
  trimValues: true
}));

const parseModuleConfig = ((xml: string): Config => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const parsed = parser.parse(xml);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const rawConfig = parsed.config;
  if(!rawConfig) {
    throw (new Error('Missing root <config> element'));
  }
  const transformed = transformModuleConfiguration(rawConfig);
  return configSchema.parse(transformed);
});

export {
  parseModuleConfig
};
