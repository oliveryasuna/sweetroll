interface FileMapSource {
  readonly modName: string;
  readonly absolutePath: string;
  readonly priority: number;
}

interface FileMapEntry {
  readonly relativePath: string;
  readonly winner: FileMapSource;
  readonly losers: (readonly FileMapSource[]);
  readonly isDirectory: boolean;
}

type FileMap = Map<string, FileMapEntry>;

export type {
  FileMapSource,
  FileMapEntry,
  FileMap
};
