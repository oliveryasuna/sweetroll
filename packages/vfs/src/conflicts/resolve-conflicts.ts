import type {ConflictReport, FileMap} from '../types';

const resolveConflicts = ((fileMap: FileMap): ConflictReport => {
  const entries = [...fileMap.values()]
    .filter(entry => (entry.losers.length > 0))
    .map(entry => ({
      relativePath: entry.relativePath,
      winnerMod: entry.winner.modName,
      loserMods: entry.losers.map(loser => loser.modName)
    }));

  return {
    totalFiles: fileMap.size,
    conflictedFiles: entries.length,
    entries: entries
  };
});

export {
  resolveConflicts
};
