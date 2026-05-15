import {copyFile, link, symlink} from 'node:fs/promises';
import type {LinkStrategy} from '../types';

type ResolvedLinkType = Exclude<LinkStrategy, 'auto'>;

interface CreateLinkResult {
  readonly linkType: ResolvedLinkType;
}

const tryLink = (async(
  sourcePath: string,
  targetPath: string,
  strategy: ResolvedLinkType
): Promise<void> => {
  switch(strategy) {
    case 'hardlink': {
      await link(sourcePath, targetPath);
      break;
    }
    case 'symlink': {
      await symlink(sourcePath, targetPath);
      break;
    }
    case 'copy': {
      await copyFile(sourcePath, targetPath);
      break;
    }
  }
});

const attemptFallbackChain = (async(
  sourcePath: string,
  targetPath: string,
  chain: (readonly ResolvedLinkType[])
): Promise<CreateLinkResult> => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let lastError: unknown;

  for(const linkType of chain) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await tryLink(sourcePath, targetPath, linkType);

      return {linkType: linkType};
    } catch(err) {
      lastError = err;
    }
  }

  throw lastError;
});

const createLink = (async(
  sourcePath: string,
  targetPath: string,
  strategy: LinkStrategy,
  sameDevice: boolean
): Promise<CreateLinkResult> => {
  if(strategy !== 'auto') {
    await tryLink(sourcePath, targetPath, strategy);

    return {linkType: strategy};
  }

  const chain: ResolvedLinkType[] = (sameDevice
    ? ['hardlink', 'symlink', 'copy']
    : ['symlink', 'copy']);

  return attemptFallbackChain(sourcePath, targetPath, chain);
});

export type {
  ResolvedLinkType,
  CreateLinkResult
};
export {
  createLink
};
