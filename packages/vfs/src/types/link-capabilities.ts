interface LinkCapabilities {
  readonly hardlink: boolean;
  readonly symlink: boolean;
  readonly symlinkRequiresAdmin: boolean;
  readonly copyFallback: true;
}

export type {
  LinkCapabilities
};
