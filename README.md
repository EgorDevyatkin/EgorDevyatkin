## Hi there 👋

Здесь же живёт исходный код моего публичного дневника тренировок.

## Дневник тренировок

Статический сайт на [Astro](https://astro.build), собранный из markdown-файлов
в `src/content/workouts/`. Деплой на GitHub Pages настроен через классический
способ — GitHub Action собирает сайт и пушит результат в ветку `gh-pages`.

Чтобы включить показ сайта (один раз): **Settings → Pages → Source: Deploy
from a branch**, ветка `gh-pages`, папка `/ (root)`. Ветка `gh-pages` появится
сама после первого прогона workflow на `main`. Сайт будет доступен по адресу:

```
https://egordevyatkin.github.io/EgorDevyatkin/
```

### Запуск локально

```
npm install
npm run dev
```

### Как добавить тренировку вручную

Создайте файл `src/content/workouts/ГГГГ-ММ-ДД-название.md` с frontmatter:

```md
---
title: "Растяжка после пробежки"
date: "2026-07-27"
sport: "gym" # running | cycling | gym | hiking | swimming | other
durationLabel: "25:00"
durationMinutes: 25
avgHr: 98        # опционально
distanceKm: 5.2  # опционально
location: "Дома"
source: "manual"
---

Текст заметки о тренировке — как прошло, ощущения и т.д.
```

Запись сразу появится на сайте после `npm run build` / деплоя.

### Синхронизация с COROS

Записи с `source: "coros"` сгенерированы скриптом `scripts/generate-workouts.mjs`
из данных COROS. Чтобы добавить новые тренировки:

1. Попросите Claude (в сессии с подключённым COROS MCP) выгрузить свежие
   записи через `querySportRecords`.
2. Добавьте новые тренировки в массив `records` в `scripts/generate-workouts.mjs`.
3. Запустите `npm run import:coros` — скрипт перегенерирует markdown-файлы.

Прямой автоматической синхронизации из браузера нет: COROS не отдаёт публичный
API без авторизации, поэтому импорт — это ручной (или периодически
запускаемый через Claude) шаг, а не живой бэкенд.
