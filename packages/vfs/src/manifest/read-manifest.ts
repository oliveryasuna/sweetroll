import {readFile} from 'node:fs/promises';
import type {DeployManifest} from '../types';
import {deployManifestSchema} from '../types';

// eslint-disable-next-line max-statements
const readManifest = (async(manifestPath: string): Promise<DeployManifest> => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let raw: string;

  try {
    raw = await readFile(manifestPath, 'utf8');
  } catch{
    const error = (new Error(`Manifest not found: ${manifestPath}`));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    (error as (Error & {code: string;})).code = 'MANIFEST_NOT_FOUND';
    throw error;
  }

  // eslint-disable-next-line @typescript-eslint/init-declarations
  let json: unknown;

  try {
    json = JSON.parse(raw);
  } catch{
    const error = (new Error(`Manifest is not valid JSON: ${manifestPath}`));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    (error as (Error & {code: string;})).code = 'MANIFEST_CORRUPT';
    throw error;
  }

  const result = deployManifestSchema.safeParse(json);

  if(!result.success) {
    const error = (new Error(`Manifest validation failed: ${result.error.message}`));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    (error as (Error & {code: string;})).code = 'MANIFEST_CORRUPT';
    throw error;
  }

  return result.data;
});

export {
  readManifest
};
