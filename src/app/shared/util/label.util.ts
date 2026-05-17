export function fromCamelCase(property: string): string {
  const name = property.replace(/^[^.]+\./, '');
  const words = name.replace(/([A-Z])/g, ' $1').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
