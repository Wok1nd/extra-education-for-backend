# День 1. Запуск и чтение User CRUD

Цель: поднять Postgres и сервер, руками пройти все операции с `/users`, понять код handlers. ИИ не проси «сделай за меня» — кликай, копируй curl, пиши своими словами.

Сначала прочитай [theory/01-http-and-json.md](../theory/01-http-and-json.md) и [theory/02-fastify-routes.md](../theory/02-fastify-routes.md).

## Чеклист запуска

- [ ] Установлен Node.js 20+
- [ ] В корне проекта: `cp .env.example .env`
- [ ] `npm install` завершился без ошибки
- [ ] База есть: либо `npm run db:up` (Docker, порт 5432), либо в `.env` стоит `DATABASE_URL` из бесплатного [Neon](https://neon.tech) (`sslmode=require`)
- [ ] `npm run db:migrate` применил миграцию `init` (таблица `User`)
- [ ] `npm run dev` печатает, что сервер слушает порт 3000
- [ ] `curl http://localhost:3000/health` отвечает `{"ok":true}`

Без Docker и без Neon Prisma не к чему подключиться — `db:migrate` упадёт. Выбери один вариант и не пропускай его.

## Чеклист User CRUD

Делай запросы в Terminal (curl) или в Postman. Тело POST/PATCH — JSON, заголовок `Content-Type: application/json`.

- [ ] `GET http://localhost:3000/users` → **200**, тело — массив (сначала, скорее всего, `[]`)
- [ ] `POST http://localhost:3000/users` с телом `{"email":"ada@example.com","name":"Ada"}` → **201**, в ответе есть `id`, `email`, `name`, `createdAt`
- [ ] `GET /users` ещё раз → **200**, в массиве появилась Ada
- [ ] `GET /users/<id из ответа POST>` → **200**, тот же пользователь
- [ ] `PATCH /users/<id>` с телом `{"name":"Ada Lovelace"}` → **200**, имя обновилось
- [ ] `DELETE /users/<id>` → **204**, тело пустое
- [ ] `GET /users/<тот же id>` после удаления → **404**
- [ ] `POST /users` с телом `{}` или без `email` → **400**
- [ ] `GET /users/not-a-real-id` → запиши статус в ответ дня (ожидай **404**)

Повторный `POST` с тем же `email` может дать **500**: в schema поле `email` уникальное, Prisma падает на constraint. Это ожидаемо. Возьми другой адрес или сначала удали пользователя.

Примеры curl:

```bash
curl http://localhost:3000/health

curl http://localhost:3000/users

curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","name":"Ada"}'

curl http://localhost:3000/users/PASTE_ID_HERE

curl -X PATCH http://localhost:3000/users/PASTE_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace"}'

curl -X DELETE http://localhost:3000/users/PASTE_ID_HERE
```

## Чеклист чтения кода

Открой файлы и отметь, что нашёл своими глазами (не по пересказу чата):

- [ ] `src/index.ts` — откуда берётся `PORT`
- [ ] `src/app.ts` — где `/health` и где `register` модуля users
- [ ] `src/modules/users/users.routes.ts` — как `GET /` превращается в `GET /users`
- [ ] `src/modules/users/users.handlers.ts` — где 400, где 404, где 201, где 204
- [ ] `src/lib/prisma.ts` — одна строка `new PrismaClient()`
- [ ] `prisma/schema.prisma` — поля User и закомментированный Task

## Письменный ответ

Создай файл `answers/day1.md` (папку `answers` создай сам). Напиши **5–7 предложений** своими словами:

1. Что делает handler при `POST /users` и когда он отвечает 400.
2. Как сервер понимает, какого пользователя вернуть в `GET /users/:id`.
3. Какой статус ты получил на несуществующий id и почему это не 200.

Чеклист ответа:

- [ ] Файл `answers/day1.md` существует
- [ ] Текст 5–7 предложений, не список цитат из теории
- [ ] Упомянут фактический статус на «неправильный» id

## Готово, если

Сервер жив, все методы `/users` ты вызвал сам, код handlers прочитан, `answers/day1.md` написан. Завтра — Prisma-связи и свой CRUD задач.
