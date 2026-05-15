type LinkStrategy = 'hardlink' | 'symlink' | 'copy' | 'auto';

interface DeployProgress {
  readonly completed: number;
  readonly total: number;
  readonly currentFile: string;
}

interface DeployOptions {
  readonly targetDir: string;
  readonly strategy?: LinkStrategy;
  readonly concurrency?: number;
  readonly manifestPath?: string;
  readonly dryRun?: boolean;
  onProgress?(progress: DeployProgress): void;
}

export type {
  LinkStrategy,
  DeployProgress,
  DeployOptions
};
