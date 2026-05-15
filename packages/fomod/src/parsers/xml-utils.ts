const toArray = (<T>(val: (T | T[] | null | undefined)): T[] => {
  // eslint-disable-next-line no-eq-null, eqeqeq
  if(val == null) {
    return [];
  }
  return (Array.isArray(val) ? val : [val]);
});

const parseBool = ((
  val: unknown,
  fallback: boolean
): boolean => {
  // eslint-disable-next-line no-eq-null, eqeqeq
  if(val == null) {
    return fallback;
  }
  if(typeof val === 'boolean') {
    return val;
  }
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const str = String(val).toLowerCase();
  if(str === 'true') {
    return true;
  }
  if(str === 'false') {
    return false;
  }
  return fallback;
});

const parseIntVal = ((
  val: unknown,
  fallback: number
): number => {
  // eslint-disable-next-line no-eq-null, eqeqeq
  if(val == null) {
    return fallback;
  }
  const n = Number(val);
  return (Number.isFinite(n) ? n : fallback);
});

const textContent = ((raw: unknown): string => {
  if(typeof raw === 'string') {
    return raw;
  }
  if((typeof raw === 'object') && (raw !== null)) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/no-unsafe-type-assertion
    return String((raw as Record<string, unknown>)['#text'] ?? '');
  }
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return String(raw ?? '');
});

const attr = ((
  raw: unknown,
  name: string
): (string | undefined) => {
  if((typeof raw !== 'object') || (raw === null)) {
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return ((raw as Record<string, unknown>)[`@_${name}`] as (string | undefined));
});

export {
  toArray,
  parseBool,
  parseIntVal,
  textContent,
  attr
};
