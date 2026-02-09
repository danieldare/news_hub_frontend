/**
 * Simple string hash for generating deterministic IDs from URLs or API IDs.
 * Not cryptographic — just for deduplication keys.
 */
export function hashId(input: string, prefix: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `${prefix}-${Math.abs(hash).toString(36)}`;
}
