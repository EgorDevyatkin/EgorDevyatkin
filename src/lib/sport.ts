export const SPORT_LABELS: Record<string, string> = {
  running: 'Бег',
  cycling: 'Вело',
  gym: 'Зал',
  hiking: 'Поход',
  swimming: 'Плавание',
  other: 'Другое',
};

export function sportLabel(sport: string): string {
  return SPORT_LABELS[sport] ?? sport;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDistance(km: number): string {
  return `${km.toFixed(2)} км`;
}
