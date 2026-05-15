import {XMLParser} from 'fast-xml-parser';
import type {Info} from '../schemas';
import {infoSchema} from '../schemas';
import {textContent, attr} from './xml-utils';

const parser = (new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: false,
  parseTagValue: false,
  trimValues: true
}));

// eslint-disable-next-line max-statements, complexity, max-lines-per-function
const transformInfo = ((raw: any): Info => {
  const result: Record<string, unknown> = {};

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-eq-null, eqeqeq
  if(raw.Name != null) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    result.Name = String(raw.Name);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-eq-null, eqeqeq
  if(raw.Author != null) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    result.Author = String(raw.Author);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-eq-null, eqeqeq
  if(raw.Description != null) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    result.Description = String(raw.Description);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-eq-null, eqeqeq
  if(raw.Website != null) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    result.Website = String(raw.Website);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-eq-null, eqeqeq
  if(raw.Id != null) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    result.Id = String(raw.Id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-eq-null, eqeqeq
  if(raw.Version != null) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const machineVersion = attr(raw.Version, 'MachineVersion');
    // eslint-disable-next-line no-eq-null, eqeqeq
    if(machineVersion == null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      result.Version = textContent(raw.Version);
    } else {
      result.Version = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        value: textContent(raw.Version),
        MachineVersion: machineVersion
      };
    }
  }

  // Pass through unknown extension elements (xs:any)
  const KNOWN_KEYS = (new Set(['Name', 'Author', 'Version', 'Description', 'Website', 'Id']));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  for(const key of Object.keys(raw)) {
    if(!key.startsWith('@_') && !KNOWN_KEYS.has(key)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      result[key] = raw[key];
    }
  }

  return result;
});

const parseInfo = ((xml: string): Info => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const parsed = parser.parse(xml);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const rawInfo = parsed.fomod;
  if(!rawInfo) {
    throw (new Error('Missing root <fomod> element'));
  }
  const transformed = transformInfo(rawInfo);
  return infoSchema.parse(transformed);
});

export {
  parseInfo
};
