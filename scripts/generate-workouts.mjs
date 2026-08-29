// Converts a curated snapshot of COROS activity records into markdown content
// files for the "workouts" collection. Re-run after pulling fresh COROS data
// (see README.md "Синхронизация с COROS") to add newly completed workouts.
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'workouts');

// sport: 'running' | 'cycling' | 'gym'
const records = [
  { date: '2026-08-29', sport: 'cycling', location: 'Мытищи Шоссер', duration: '1:27:11', durationMinutes: 87.2, distanceKm: 41.01, avgSpeed: '28.2 km/h', avgHr: 156, calories: 867, labelId: '479964166289916109' },
  { date: '2026-08-28', sport: 'cycling', location: 'Мытищи Шоссер', duration: '1:51:05', durationMinutes: 111.1, distanceKm: 40.32, avgSpeed: '21.8 km/h', avgHr: 133, calories: 834, labelId: '479946396131164165' },
  { date: '2026-08-27', sport: 'cycling', location: 'Мытищи Шоссер', duration: '1:18:15', durationMinutes: 78.3, distanceKm: 29.22, avgSpeed: '22.4 km/h', avgHr: 144, calories: 680, labelId: '479924227925901913' },
  { date: '2026-08-24', sport: 'running', location: 'Мытищи Бег', duration: '44:02', durationMinutes: 44.0, distanceKm: 8.02, avgPace: '5:29 /km', avgHr: 146, calories: 513, labelId: '479852954822672686' },
  { date: '2026-08-21', sport: 'cycling', location: 'Истра муниципальный округ Шоссер', duration: '2:07:03', durationMinutes: 127.1, distanceKm: 44.84, avgSpeed: '21.2 km/h', avgHr: 137, calories: 1007, labelId: '479784656789602310' },
  { date: '2026-08-20', sport: 'cycling', location: 'Мытищи Шоссер', duration: '1:05:22', durationMinutes: 65.4, distanceKm: 25.82, avgSpeed: '23.7 km/h', avgHr: 138, calories: 523, labelId: '479761714416484352' },
  { date: '2026-08-19', sport: 'running', location: 'Мытищи Бег', duration: '55:32', durationMinutes: 55.5, distanceKm: 10.03, avgPace: '5:32 /km', avgHr: 153, calories: 696, labelId: '479738268458451148' },
  { date: '2026-08-17', sport: 'cycling', location: 'Мытищи Шоссер', duration: '1:14:50', durationMinutes: 74.8, distanceKm: 30.19, avgSpeed: '24.2 km/h', avgHr: 139, calories: 609, labelId: '479691337350807657' },
  { date: '2026-08-16', sport: 'cycling', location: 'Мытищи Шоссер', duration: '1:13:58', durationMinutes: 74.0, distanceKm: 21.27, avgSpeed: '17.3 km/h', avgHr: 129, calories: 520, labelId: '479659873762574639' },
  { date: '2026-08-15', sport: 'cycling', location: 'Москва Шоссер', duration: '1:37:26', durationMinutes: 97.4, distanceKm: 21.39, avgSpeed: '13.2 km/h', avgHr: 128, calories: 675, labelId: '479647863693934794' },
  { date: '2026-08-12', sport: 'running', location: 'Мытищи Бег', duration: '57:32', durationMinutes: 57.5, distanceKm: 10.14, avgPace: '5:40 /km', avgHr: 148, calories: 684, labelId: '479576490732716134' },
  { date: '2026-08-11', sport: 'running', location: '5 серий (300м+200м+100м)', duration: '1:07:06', durationMinutes: 67.1, distanceKm: 12.69, avgPace: '5:17 /km', avgHr: 157, calories: 884, labelId: '479552325636096008' },
  { date: '2026-08-10', sport: 'running', location: '8 км и горка', duration: '59:51', durationMinutes: 59.9, distanceKm: 11.02, avgPace: '5:26 /km', avgHr: 150, calories: 732, labelId: '479529006648033281' },
  { date: '2026-08-08', sport: 'running', location: 'Кольчугинский район Бег', duration: '1:07:37', durationMinutes: 67.6, distanceKm: 12.08, avgPace: '5:36 /km', avgHr: 156, calories: 876, labelId: '479476570463961191' },
  { date: '2026-08-07', sport: 'running', location: '4 км, спокойный бег', duration: '44:53', durationMinutes: 44.9, distanceKm: 8.58, avgPace: '5:14 /km', avgHr: 159, calories: 606, labelId: '479458089758654464' },
  { date: '2026-08-04', sport: 'running', location: 'Мытищи Бег', duration: '30:56', durationMinutes: 30.9, distanceKm: 6.02, avgPace: '5:08 /km', avgHr: 158, calories: 413, labelId: '479390280814985216' },
  { date: '2026-08-03', sport: 'gym', location: 'Тренажёрный зал, кардио', duration: '18:37', durationMinutes: 18.6, avgHr: 111, calories: 97, labelId: '479390280546550260' },
  { date: '2026-07-31', sport: 'running', location: 'Кольчугинский район Бег', duration: '59:31', durationMinutes: 59.5, distanceKm: 10.27, avgPace: '5:48 /km', avgHr: 153, calories: 748, labelId: '479295633155457126' },
  { date: '2026-07-28', sport: 'running', location: 'Кольчугинский район Бег', duration: '41:20', durationMinutes: 41.3, distanceKm: 6.44, avgPace: '6:25 /km', avgHr: 146, calories: 492, labelId: '479225509224415537' },
  { date: '2026-07-26', sport: 'running', location: 'Суздальский район Бег', duration: '6:35:56', durationMinutes: 395.9, distanceKm: 52.96, avgPace: '7:29 /km', avgHr: 161, calories: 5635, labelId: '479175550164828168', long: true },
  { date: '2026-07-24', sport: 'running', location: 'Суздальский район Бег', duration: '1:00:11', durationMinutes: 60.2, distanceKm: 10.31, avgPace: '5:50 /km', avgHr: 160, calories: 851, labelId: '479138250523443401' },
  { date: '2026-07-23', sport: 'running', location: 'Кольчугинский район Бег', duration: '30:14', durationMinutes: 30.2, distanceKm: 5.18, avgPace: '5:50 /km', avgHr: 145, calories: 357, labelId: '479110407053672450' },
  { date: '2026-07-21', sport: 'running', location: '2 по 1200м + 5 по 400м', duration: '52:45', durationMinutes: 52.8, distanceKm: 9.86, avgPace: '5:21 /km', avgHr: 152, calories: 678, labelId: '479063153286611046' },
  { date: '2026-07-19', sport: 'running', location: 'Кольчугинский район Бег', duration: '1:57:19', durationMinutes: 117.3, distanceKm: 20.05, avgPace: '5:51 /km', avgHr: 154, calories: 1553, labelId: '479010722204909871' },
  { date: '2026-07-18', sport: 'running', location: 'Кольчугинский район Бег', duration: '40:06', durationMinutes: 40.1, distanceKm: 7.23, avgPace: '5:33 /km', avgHr: 153, calories: 524, labelId: '478995600698802878' },
  { date: '2026-07-17', sport: 'running', location: '10 по 1 км', duration: '1:09:49', durationMinutes: 69.8, distanceKm: 12.16, avgPace: '5:45 /km', avgHr: 165, calories: 1047, labelId: '478969457769742739' },
  { date: '2026-07-14', sport: 'running', location: 'Мытищи Бег', duration: '1:06:50', durationMinutes: 66.8, distanceKm: 11.25, avgPace: '5:57 /km', avgHr: 154, calories: 884, labelId: '478891318358081538' },
  { date: '2026-07-13', sport: 'running', location: 'Бег', duration: '32:08', durationMinutes: 32.1, distanceKm: 5.37, avgPace: '5:59 /km', avgHr: 154, calories: 423, labelId: '478877659825209545' },
  { date: '2026-07-12', sport: 'running', location: 'Москва Бег', duration: '2:32:27', durationMinutes: 152.5, distanceKm: 25.69, avgPace: '5:56 /km', avgHr: 157, calories: 2092, labelId: '478850738433327506', long: true },
  { date: '2026-07-11', sport: 'running', location: 'Мытищи Бег', duration: '45:59', durationMinutes: 46.0, distanceKm: 8.02, avgPace: '5:44 /km', avgHr: 147, calories: 554, labelId: '478832260141842734' },
  { date: '2026-07-10', sport: 'running', location: '4 по 2 км', duration: '1:01:28', durationMinutes: 61.5, distanceKm: 10.83, avgPace: '5:41 /km', avgHr: 171, calories: 979, labelId: '478810015698812936' },
  { date: '2026-07-09', sport: 'running', location: 'Мытищи Бег', duration: '1:09:47', durationMinutes: 69.8, distanceKm: 12.03, avgPace: '5:48 /km', avgHr: 148, calories: 859, labelId: '478788049893884204' },
  { date: '2026-07-04', sport: 'running', location: 'Санкт-Петербург Бег', duration: '43:42', durationMinutes: 43.7, distanceKm: 10.11, avgPace: '4:19 /km', avgHr: 183, calories: 780, labelId: '478672552856682505' },
  { date: '2026-07-03', sport: 'running', location: 'Санкт-Петербург Бег', duration: '40:26', durationMinutes: 40.4, distanceKm: 7.30, avgPace: '5:32 /km', avgHr: 159, calories: 567, labelId: '478644404446331080' },
  { date: '2026-07-01', sport: 'running', location: '12 км, спокойный бег', duration: '1:10:37', durationMinutes: 70.6, distanceKm: 12.03, avgPace: '5:52 /km', avgHr: 149, calories: 876, labelId: '478603142963953969' },
  { date: '2026-06-30', sport: 'running', location: '2 серии (6 по 400м)', duration: '52:33', durationMinutes: 52.6, distanceKm: 9.14, avgPace: '5:45 /km', avgHr: 158, calories: 724, labelId: '478579320927846400' },
  { date: '2026-06-29', sport: 'running', location: '8 км по самочувствию и ускорения', duration: '47:08', durationMinutes: 47.1, distanceKm: 8.04, avgPace: '5:52 /km', avgHr: 150, calories: 593, labelId: '478555538353848519' },
  { date: '2026-06-28', sport: 'running', location: 'Мытищи Бег', duration: '1:25:07', durationMinutes: 85.1, distanceKm: 15.04, avgPace: '5:40 /km', avgHr: 156, calories: 1154, labelId: '478527765216264292' },
  { date: '2026-06-27', sport: 'running', location: '12 по 500м/80сек', duration: '1:01:21', durationMinutes: 61.4, distanceKm: 12.26, avgPace: '5:00 /km', avgHr: 161, calories: 883, labelId: '478503441467998411' },
  { date: '2026-06-23', sport: 'running', location: 'Мытищи Бег', duration: '1:01:32', durationMinutes: 61.5, distanceKm: 12.03, avgPace: '5:07 /km', avgHr: 162, calories: 890, labelId: '478416377923797196' },
  { date: '2026-06-22', sport: 'running', location: 'Мытищи Бег', duration: '55:25', durationMinutes: 55.4, distanceKm: 10.01, avgPace: '5:32 /km', avgHr: 155, calories: 725, labelId: '478391963719073795' },
  { date: '2026-06-20', sport: 'running', location: 'Москва Бег', duration: '46:03', durationMinutes: 46.1, distanceKm: 10.12, avgPace: '4:33 /km', avgHr: 179, calories: 769, labelId: '478349115239989748' },
  { date: '2026-06-19', sport: 'running', location: 'Мытищи Бег', duration: '38:33', durationMinutes: 38.6, distanceKm: 6.83, avgPace: '5:39 /km', avgHr: 151, calories: 472, labelId: '478326155687002212' },
];

const isPlanLabel = (loc) =>
  /\d/.test(loc) && /по|сер|км|горка|уско|смч/i.test(loc);

function makeTitle(r) {
  if (isPlanLabel(r.location)) return r.location.trim();
  if (r.sport === 'running') {
    const city = r.location.replace(/Бег/i, '').trim();
    return city ? `Пробежка — ${city}` : 'Пробежка';
  }
  if (r.sport === 'cycling') {
    const city = r.location.replace(/Шоссер/i, '').trim();
    return city ? `Велотренировка — ${city}` : 'Велотренировка';
  }
  if (r.sport === 'gym') return 'Тренажёрный зал';
  return r.location || 'Тренировка';
}

function makeNotes(r) {
  const lines = [];
  if (r.long) {
    lines.push(
      r.distanceKm > 30
        ? 'Длинная тренировка на выносливость.'
        : 'Длинная пробежка в спокойном темпе.'
    );
  }
  if (isPlanLabel(r.location)) {
    lines.push(`План тренировки: ${r.location.trim()}.`);
  }
  lines.push('Синхронизировано из COROS.');
  return lines.join('\n\n');
}

function slugFor(r) {
  return `${r.date}-${r.sport}-${r.labelId.slice(-6)}`;
}

mkdirSync(OUT_DIR, { recursive: true });

for (const r of records) {
  const frontmatter = {
    title: makeTitle(r),
    date: r.date,
    sport: r.sport,
    durationLabel: r.duration,
    durationMinutes: r.durationMinutes,
    ...(r.distanceKm ? { distanceKm: r.distanceKm } : {}),
    ...(r.avgHr ? { avgHr: r.avgHr } : {}),
    ...(r.avgPace ? { avgPace: r.avgPace } : {}),
    ...(r.avgSpeed ? { avgSpeed: r.avgSpeed } : {}),
    ...(r.calories ? { calories: r.calories } : {}),
    location: r.location,
    source: 'coros',
  };

  const yaml = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${typeof v === 'string' ? JSON.stringify(v) : v}`)
    .join('\n');

  const content = `---\n${yaml}\n---\n\n${makeNotes(r)}\n`;
  const file = path.join(OUT_DIR, `${slugFor(r)}.md`);
  writeFileSync(file, content, 'utf8');
}

console.log(`Generated ${records.length} workout entries in ${OUT_DIR}`);
