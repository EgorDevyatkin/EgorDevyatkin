# Вишлист-платформа

Next.js + Supabase. Личный кабинет по email/паролю, публичная страница
вишлиста на `/u/<ник>`, добавление хотелки по ссылке (подтягивается
название/картинка/цена), прогресс-бар сбора донатов на каждой хотелке.

Донаты пока обновляются вручную в личном кабинете (поле «Собрано») —
автоматический приём и подсчёт через ЮMoney будет добавлен отдельным шагом,
когда появится доступ к их API.

## 1. Применить схему базы данных (один раз)

1. Откройте свой проект на [supabase.com](https://supabase.com)
2. Слева в меню: **SQL Editor** → **New query**
3. Откройте файл [`supabase/schema.sql`](./supabase/schema.sql) из этого репозитория, скопируйте всё содержимое и вставьте в редактор
4. Нажмите **Run**. Должно появиться "Success. No rows returned"

Скрипт безопасно перезапускать — если что-то поменяется, просто прогоните
файл заново.

## 2. Настроить редирект после подтверждения email

1. В Supabase: **Authentication** → **URL Configuration**
2. **Site URL**: адрес будущего сайта на Vercel, например `https://your-project.vercel.app`
3. **Redirect URLs**: добавьте `https://your-project.vercel.app/auth/callback` и, для локальной разработки, `http://localhost:3000/auth/callback`

## 3. Локальный запуск

```
cd platform
npm install
cp .env.example .env.local   # впишите свои значения из Supabase → Settings → API
npm run dev
```

## 4. Деплой на Vercel

1. На [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Выберите репозиторий `EgorDevyatkin/EgorDevyatkin`
3. В настройках импорта укажите **Root Directory**: `platform` (это важно — иначе Vercel попытается собрать весь репозиторий целиком)
4. В **Environment Variables** добавьте:
   - `NEXT_PUBLIC_SUPABASE_URL` — из Supabase Settings → API
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — оттуда же (значение `anon` / `publishable`)
5. Нажмите **Deploy**
6. После первого деплоя скопируйте выданный адрес (`https://....vercel.app`) и впишите его в шаг 2 выше (Site URL / Redirect URLs в Supabase) — без этого подтверждение email будет вести не туда

## Структура

- `supabase/schema.sql` — таблицы `profiles`, `wishlist_items`, политики RLS, триггер создания профиля при регистрации
- `app/register`, `app/login` — регистрация и вход
- `app/dashboard` — личный кабинет: добавление хотелки по ссылке, редактирование, удаление
- `app/u/[handle]` — публичная страница вишлиста
- `lib/fetchMetadata.ts` — серверная функция, которая скачивает страницу по ссылке и достаёт title/описание/картинку/цену из OpenGraph-тегов
