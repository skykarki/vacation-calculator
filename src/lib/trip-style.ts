export const TRIP_PALETTES = [
  ["#0f766e", "#115e59"],
  ["#1d4ed8", "#1e3a8a"],
  ["#c2410c", "#9a3412"],
  ["#7c3aed", "#5b21b6"],
  ["#0e7490", "#155e75"],
  ["#b45309", "#92400e"],
];

export function tripPalette(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TRIP_PALETTES[Math.abs(hash) % TRIP_PALETTES.length];
}

export function tripStatus(startDate: Date | string, endDate: Date | string, now = new Date()) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now < start) return "Upcoming";
  if (now > end) return "Past";
  return "Ongoing";
}
