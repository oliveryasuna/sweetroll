interface ConflictReportEntry {
  readonly relativePath: string;
  readonly winnerMod: string;
  readonly loserMods: (readonly string[]);
}

interface ConflictReport {
  readonly totalFiles: number;
  readonly conflictedFiles: number;
  readonly entries: (readonly ConflictReportEntry[]);
}

export type {
  ConflictReportEntry,
  ConflictReport
};
