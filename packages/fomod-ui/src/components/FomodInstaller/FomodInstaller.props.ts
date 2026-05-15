import type {FileDependencyState, FileSystemItem, ModuleConfiguration} from '@sweetroll/fomod';

interface FomodInstallerProps {
  config: ModuleConfiguration;
  fileStates?: Record<string, FileDependencyState>;
  gameVersion?: string;
  fommVersion?: string;
  onInstall(files: FileSystemItem[]): void;
  onCancel(): void;
}

export type {
  FomodInstallerProps
};
