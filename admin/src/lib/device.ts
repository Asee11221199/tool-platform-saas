export function normalizeFingerprint(value: string) {
  return value.trim().replace(/\s+/g, '').toLowerCase();
}