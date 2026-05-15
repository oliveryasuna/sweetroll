import {stat} from 'node:fs/promises';

const isSameDevice = (async(pathA: string, pathB: string): Promise<boolean> => {
  const [statA, statB] = await Promise.all([stat(pathA), stat(pathB)]);

  return (statA.dev === statB.dev);
});

export {
  isSameDevice
};
