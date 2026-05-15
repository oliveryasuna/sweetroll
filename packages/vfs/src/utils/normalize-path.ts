const normalizePath = ((filePath: string, caseSensitive = false): string => {
  const normalized = filePath.replaceAll('\\', '/');

  return (caseSensitive ? normalized : normalized.toLowerCase());
});

export {
  normalizePath
};
