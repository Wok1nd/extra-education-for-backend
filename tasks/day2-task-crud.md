# День 2. Task CRUD своими руками

Цель: добавить сущность Task, связанную с User, и собрать модуль `tasks` по образцу `users`. Это главная практика курса. Не генерируй весь модуль одним промптом — копируй файлы, меняй имена, проверяй каждый статус.

Сначала прочитай [theory/03-prisma-and-db.md](../theory/03-prisma-and-db.md) и [theory/04-errors-and-status.md](../theory/04-errors-and-status.md).

## 1. Модель и миграция

- [ ] В `prisma/schema.prisma` раскомментировал модель `Task`
- [ ] В модели `User` раскомментировал `tasks Task[]`
- [ ] Поля Task: `title`, `done Boolean @default(false)`, `userId`, связь `user User @relation(...)`
- [ ] Выполнил `npx prisma migrate dev --name add_task` без ошибок
- [ ] В Prisma Studio (`npm run db:studio`) видна таблица Task

## 2. Модуль как у users

Скопируй папку `src/modules/users/` в `src/modules/tasks/` и переименуй файлы/функции.

- [ ] Есть `src/modules/tasks/tasks.routes.ts`
- [ ] Есть `src/modules/tasks/tasks.handlers.ts`
- [ ] В `src/app.ts` модуль зарегистрирован: `app.register(tasksRoutes, { prefix: '/tasks' })`
- [ ] Обработчики ходят в `prisma.task`, не в `prisma.user`

## 3. Контракт HTTP

| Метод | URL | Успех | Ошибки |
| --- | --- | --- | --- |
| `GET` | `/tasks` | **200**, массив | |
| `GET` | `/tasks/:id` | **200** | нет записи → **404** |
| `POST` | `/tasks` | **201**, тело `{ "title", "userId" }` | нет `title` или нет `userId` → **400** |
| `PATCH` | `/tasks/:id` | **200** | нет записи → **404** |
| `DELETE` | `/tasks/:id` | **204** | нет записи → **404** |

- [ ] Все пять маршрутов отвечают
- [ ] `POST` без `title` → 400
- [ ] `POST` без `userId` → 400
- [ ] `POST` с валидным `userId` существующего пользователя → 201, у задачи `done` равно `false`, если не передавал иное
- [ ] `GET`/`PATCH`/`DELETE` с выдуманным id → 404

Поле `done` на создании можно не требовать: в schema уже `@default(false)`. На `PATCH` логично разрешить менять `title` и/или `done`.

## 4. Связь с пользователем

- [ ] Нельзя осмысленно создать задачу без пользователя: либо Prisma/БД ругается на чужой `userId`, либо ты сам проверяешь `prisma.user.findUnique` и отвечаешь **404** (или **400** — один стиль на весь проект)
- [ ] После создания `GET /tasks/:id` возвращает тот же `userId`

### Необязательно, но полезно на хакатон

- [ ] `GET /users/:id/tasks` → **200** и массив задач этого пользователя; если пользователя нет → **404**

Реализуй это либо в `users.routes` (`/:id/tasks`), либо отдельным handler. Не ломай уже работающий `GET /users/:id`.

## 5. Критерии «готово» (отметь сам перед ментором)

- [ ] Миграция Task в репозитории (папка в `prisma/migrations`)
- [ ] Зеркало модуля users: routes отдельно, handlers отдельно
- [ ] CRUD на `/tasks` с кодами 200 / 201 / 204 / 400 / 404
- [ ] `POST` требует `title` и `userId`
- [ ] Нет авторизации и JWT — в v1 их не добавляем
- [ ] Я могу curl'ом: создать user → создать ему task → получить список → переключить `done` → удалить task

Прогони сценарий целиком, не только «201 на POST». Когда всё зелёное — открой [CHECKLIST.md](CHECKLIST.md) глазами ментора и закрой дыры.
