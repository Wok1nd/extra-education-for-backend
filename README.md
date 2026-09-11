# Backend за неделю: Fastify + Prisma + PostgreSQL

Короткий буткемп для фронтенд-разработчика, которому нужно освоить бэкенд перед хакатоном. Здесь нет JWT и авторизации — только HTTP, маршруты, база и CRUD.

Сначала ты **читаешь теорию**, потом **запускаешь готовый User CRUD**, потом **сам пишешь Task CRUD** по чеклисту. Задания — ручные шаги, а не «спроси у ИИ».

## Для кого

Ты уже умеешь `fetch`, JSON и React/Vue. Не умеешь (или почти не умеешь) писать сервер. За неделю нужно:

1. Понять, что такое endpoint, статус-код и тело запроса.
2. Запустить сервер Fastify локально.
3. Увидеть, как Prisma кладёт данные в PostgreSQL.
4. Самостоятельно повторить CRUD на второй сущности.

## Стек

| Что | Зачем |
| --- | --- |
| TypeScript | Тот же язык, что на фронте |
| [Fastify](https://fastify.dev/) | HTTP-сервер: маршруты и ответы |
| [Prisma](https://www.prisma.io/) | Описание таблиц + клиент для запросов к БД |
| PostgreSQL 16 | База в Docker |
| [tsx](https://tsx.is/) | Запуск `.ts` без отдельной сборки |

Prisma здесь в «классическом» стиле (версия 6): `new PrismaClient()` и `DATABASE_URL` в `.env`. Без драйвер-адаптеров Prisma 7.

## Что уже готово

- `GET /health` → `{ "ok": true }`
- полный CRUD пользователей на `/users`
- модель `User` в Prisma
- закомментированный шаблон модели `Task` — его ты включишь на дне 2

## Порядок дней

| День | Теория | Практика |
| --- | --- | --- |
| **1** | [01-http-and-json.md](theory/01-http-and-json.md), [02-fastify-routes.md](theory/02-fastify-routes.md) | [tasks/day1-run-and-read.md](tasks/day1-run-and-read.md) — Docker, миграция, сервер, User CRUD руками |
| **2** | [03-prisma-and-db.md](theory/03-prisma-and-db.md), [04-errors-and-status.md](theory/04-errors-and-status.md) | [tasks/day2-task-crud.md](tasks/day2-task-crud.md) — модель Task и свой модуль `tasks` |
| **3–7** | Повтори слабые места | Доведи Task CRUD, пройди [tasks/CHECKLIST.md](tasks/CHECKLIST.md), задай вопросы ментору |

Дни 3–7 — запас перед хакатоном: не выдумывай новые фичи, доведи статусы и связи.

## Как запустить

Нужны **Node.js 20+** и база PostgreSQL. Базу можно поднять через **Docker** (`npm run db:up`) или взять бесплатный проект на [Neon](https://neon.tech) и вставить `DATABASE_URL` в `.env`.

1. Склонируй репозиторий и зайди в папку проекта.

2. Скопируй переменные окружения:

```bash
cp .env.example .env
```

3. Поставь зависимости (после установки Prisma сама сгенерирует клиент):

```bash
npm install
```

4. Подними PostgreSQL одним из двух способов.

**Вариант A — Docker** (если Docker Desktop установлен):

```bash
npm run db:up
```

Подожди несколько секунд, пока контейнер станет `running`. Порт **5432** должен быть свободен.

**Вариант B — без Docker, бесплатный [Neon](https://neon.tech):** зайди на https://neon.tech, создай проект, скопируй connection string и в `.env` замени `DATABASE_URL` на эту строку (обычно с `?sslmode=require`). Docker для этого варианта не нужен.

5. Примени миграции (создаст таблицу `User`):

```bash
npm run db:migrate
```

Если Prisma спросит имя миграции — схема уже совпадает с папкой `prisma/migrations`, обычно имя не нужно: миграция `init` уже лежит в репозитории.

6. Запусти сервер:

```bash
npm run dev
```

Сервер слушает `http://localhost:3000` (или порт из `.env`).

7. Проверь здоровье:

```bash
curl http://localhost:3000/health
```

Ожидай: `{"ok":true}`.

Готовый User CRUD (примеры есть в задании дня 1):

| Метод | URL | Ожидание |
| --- | --- | --- |
| `GET` | `/users` | `200`, массив |
| `GET` | `/users/:id` | `200` или `404` |
| `POST` | `/users` | `201`, тело `{ "email", "name" }`; без полей — `400` |
| `PATCH` | `/users/:id` | `200` или `404` |
| `DELETE` | `/users/:id` | `204` или `404` |

Посмотреть таблицы в браузере: `npm run db:studio`.

### Скрипты

| Скрипт | Что делает |
| --- | --- |
| `npm run dev` | Сервер с автоперезапуском (`tsx watch`) |
| `npm run db:up` | `docker compose up -d` — Postgres 16 |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:studio` | GUI Prisma Studio |

## Карта файлов

```
├── README.md
├── docker-compose.yml      # Postgres 16, порт 5432
├── package.json
├── tsconfig.json
├── .env.example            # PORT, DATABASE_URL
├── prisma/schema.prisma    # User готов; Task — закомментированный TODO
├── src/
│   ├── index.ts            # слушает порт
│   ├── app.ts              # Fastify: /health и маршруты
│   ├── lib/prisma.ts       # new PrismaClient()
│   └── modules/users/      # готовый образец CRUD
├── theory/                 # короткие конспекты
└── tasks/                  # человеческие чеклисты
```

На дне 2 ты копируешь `src/modules/users/` → `src/modules/tasks/` и подключаешь маршруты в `app.ts`.

## Правила обучения

- Сначала теория, потом код. Не пропускай `theory/`.
- User CRUD **не переписывай с нуля** — читай и дергай запросами.
- Task CRUD **пиши сам**, глядя на users. Не проси ИИ «сделай Task CRUD».
- Ответ дня 1 положи в `answers/day1.md` (папку создай сам).

## Если что-то не стартует

- **Порт 5432 занят** — останови другой Postgres или смени порт в `docker-compose.yml` и в `DATABASE_URL`.
- **Docker не установлен** — используй бесплатный [Neon](https://neon.tech): в `.env` подставь их `DATABASE_URL` (с `sslmode=require`) и запусти `npm run db:migrate`. Либо поставь Docker Desktop и `npm run db:up`.
- **`P1001: Can't reach database`** — Docker-контейнер ещё не готов, или Neon-строка без `sslmode=require` / опечатка. Проверь `.env` и повтори `npm run db:migrate`.
- **Нет `.env`** — `tsx --env-file=.env` не найдёт файл; скопируй `.env.example`.

## Источники

Официальные и учебные материалы, на которых собран курс. Конспекты в `theory/` переписаны своими словами — читай их, а в источники заглядывай, если нужно уточнение.

- [Fastify: TypeScript](https://fastify.dev/docs/latest/Reference/TypeScript/)
- [Prisma + Fastify](https://www.prisma.io/fastify)
- [Build a REST API with Fastify](https://blog.openreplay.com/build-rest-api-fastify/)
- [AlreadyBored / nodejs-assignments — crud-api](https://github.com/AlreadyBored/nodejs-assignments) (практика статус-кодов)
- [Prisma: one-to-many relations](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-many-relations)
