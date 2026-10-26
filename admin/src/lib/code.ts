const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateCode(prefix: string, length: number = 12) {
  let code = '';

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * CHARS.length);
    code += CHARS[index];
  }

  return `${prefix}-${code}`;
}

export function generateBatchCodes(count: number, prefix: string = 'USER') {
  const items: string[] = [];
  for (let i = 0; i < count; i++) {
    items.push(generateCode(prefix, 12));
  }
  return items;
}