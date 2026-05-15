interface PurgeProgress {
  readonly completed: number;
  readonly total: number;
}

interface PurgeOptions {
  readonly removeEmptyDirs?: boolean;
  readonly concurrency?: number;
  readonly manifestPath?: string;
  onProgress?(progress: PurgeProgress): void;
}

export type {
  PurgeProgress,
  PurgeOptions
};
