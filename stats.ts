'use client';
const K = 'ocan_ai_stats';
export interface Stats {
  visitors: number; usage: number;
  Premium: number; Admin: number; Developer: number; Owner: number; CEO: number; Mafia: number;
}
const DEFAULT: Stats = {
  visitors: 1287, usage: 4319,
  Premium: 128, Admin: 12, Developer: 6, Owner: 3, CEO: 1, Mafia: 1,
};
export function getStats(): Stats {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = localStorage.getItem(K);
    if (!raw) { localStorage.setItem(K, JSON.stringify(DEFAULT)); return DEFAULT; }
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch { return DEFAULT; }
}
export function bumpVisit() {
  const s = getStats(); s.visitors += 1;
  localStorage.setItem(K, JSON.stringify(s));
}
export function bumpUsage() {
  const s = getStats(); s.usage += 1;
  localStorage.setItem(K, JSON.stringify(s));
}