export function parseLocation(location: string): [string, string] {
  const match = location.match(/^(.+)\s*\((\d{6})\)$/);
  return match ? [match[1], match[2]] : [location, ""];
}
export function parsePrice(priceStr: string): number {
  return Number(priceStr.replace(/[^\d]/g, "")) || 0;
}