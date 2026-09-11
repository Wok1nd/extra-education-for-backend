# 03. Prisma и база данных

Фронтенд держит данные в state или в localStorage. Бэкенд кладёт их в **базу** — отдельный процесс, который переживает перезапуск сервера. В этом курсе база — PostgreSQL, доступ к ней — через Prisma.

## Три слоя

1. **`schema.prisma`** — описание таблиц человекочитаемым языком. Это контракт: какие поля, какие связи.
2. **Миграция** — SQL-файлы в `prisma/migrations`. Они создают или меняют таблицы в Postgres. Команда: `npm run db:migrate` (`prisma migrate dev`).
3. **Prisma Client** — сгенерированный TypeScript-клиент. После `npm install` (у нас есть `postinstall: prisma generate`) в коде появляется `prisma.user.findMany()` и автодополнение полей.

Порядок всегда такой: поменял schema → прогнал migrate → клиент обновился → пишешь handler.

## Классический клиент

В `src/lib/prisma.ts` нет адаптеров и лишней магии:

```ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
```

Откуда берётся адрес базы? Из переменной **`DATABASE_URL`** в `.env`. Prisma читает её и при старте открывает соединение с Postgres. Строка вида:

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

Docker из `docker-compose.yml` поднимает Postgres на `localhost:5432`, пользователь `postgres`, база `bootcamp` — это уже прописано в `.env.example`.

## Модель User (уже есть)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
}
```

- `@id` — первичный ключ, уникальный идентификатор строки.
- `@default(cuid())` — id генерирует сервер, клиент его не присылает.
- `@unique` на `email` — два пользователя с одним email не запишутся.

В handler это выглядит так: `prisma.user.create({ data: { email, name } })`. Имена методов совпадают с HTTP: findMany ≈ GET список, findUnique ≈ GET один, create ≈ POST, update ≈ PATCH, delete ≈ DELETE.

## Связи и внешние ключи

На дне 2 появится Task. Задача **принадлежит** пользователю: у задачи есть `userId`, который указывает на `User.id`. Это **внешний ключ** (foreign key).

Связь **один ко многим**: один User — много Task. В schema это два конца:

```prisma
model User {
  id    String @id @default(cuid())
  tasks Task[]
}

model Task {
  id     String @id @default(cuid())
  title  String
  done   Boolean @default(false)
  userId String
  user   User   @relation(fields: [userId], references: [id])
}
```

`fields: [userId]` — колонка в таблице Task. `references: [id]` — колонка в User. Prisma не даст создать задачу с `userId`, которого нет в таблице пользователей (база вернёт ошибку).

Готовый шаблон этой модели лежит комментарием в `prisma/schema.prisma`. Раскомментируй оба конца связи, затем `npx prisma migrate dev --name add_task`.

## Что запомнить

- Schema — правда о таблицах. Миграция применяет её к Postgres. Client — как ты к таблицам обращаешься из TypeScript.
- `DATABASE_URL` — единственный адрес базы для этого скелета.
- `userId` на Task — ссылка на User, не «просто строка в JSON».
