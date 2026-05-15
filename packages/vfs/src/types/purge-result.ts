interface PurgeError {
  readonly path: string;
  readonly error: string;
}

interface PurgeResult {
  readonly removedLinks: number;
  readonly removedDirs: number;
  readonly errors: (readonly PurgeError[]);
}

export type {
  PurgeError,
  PurgeResult
};
