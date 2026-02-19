export function contrastTextClass(bgHex?: string | null): string {
  if (!bgHex) return 'text-white!';

  const rgb = hexToRgb(bgHex);
  if (!rgb) return 'text-white!';

  const luminance = getLuminance(rgb);

  return luminance > 0.55 ? 'text-black!' : 'text-white!';
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return null;

  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;

  return { r, g, b };
}

function getLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
