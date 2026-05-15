import type {FileSystemItem} from '@sweetroll/fomod';

interface InstallSummaryProps {
  files: FileSystemItem[];
  onConfirm(): void;
  onCancel(): void;
}

export type {
  InstallSummaryProps
};
