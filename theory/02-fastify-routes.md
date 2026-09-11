# 02. Маршруты Fastify

Fastify — библиотека, которая поднимает HTTP-сервер. Ты описываешь: «если пришёл такой метод и такой путь — вызови эту функцию».

В этом проекте сервер собирается в `src/app.ts`, а слушает порт в `src/index.ts`. Так проще тестировать приложение отдельно от «повеситься на 3000».

## Регистрация маршрута

Самый короткий вид:

```ts
app.get('/health', async () => {
  return { ok: true }
})
```

- `app.get` / `app.post` / `app.patch` / `app.delete` — метод.
- Первый аргумент — путь.
- Второй — **handler**: функция `(request, reply)`.

Если handler возвращает объект, Fastify сам отправит его как JSON со статусом 200. Когда статус другой (201, 404), статус ставят явно через `reply`.

## request: params и body

`request.params` — куски пути. Маршрут `GET /users/:id` при запросе `/users/abc` даёт `{ id: 'abc' }`.

`request.body` — разобранный JSON. Для `POST /users` это `{ email, name }`.

Пример типов, как в нашем коде:

```ts
request: FastifyRequest<{ Params: { id: string }; Body: { email?: string } }>
```

Это подсказка TypeScript'у. В рантайме Fastify всё равно кладёт строки из URL в `params` и объект из JSON в `body`.

## reply.code

`reply` — ответ, который ещё не ушёл клиенту.

```ts
return reply.code(201).send(user)
return reply.code(404).send({ message: 'User not found' })
return reply.code(204).send()
```

Цепочка такая: сначала код, потом тело. У 204 тела нет — `send()` без аргумента.

Не забудь `return`: иначе handler может пойти дальше и попытаться ответить второй раз.

## Префикс модуля

В `app.ts` маршруты пользователей подключены так:

```ts
app.register(usersRoutes, { prefix: '/users' })
```

Внутри `users.routes.ts` пути короткие: `/`, `/:id`. С префиксом они становятся `/users` и `/users/:id`. На дне 2 сделаешь то же для `/tasks`.

## routes vs handlers

| Файл | Роль |
| --- | --- |
| `users.routes.ts` | Только таблица: какой метод/путь → какая функция |
| `users.handlers.ts` | Работа: проверить поля, сходить в Prisma, выбрать статус |

Так проще копировать модуль. Сначала скопируй routes и повесь handlers, потом меняй имена `user` → `task`.

## Логи

`Fastify({ logger: true })` печатает каждый запрос в терминал. Если curl «молчит», смотри этот лог: там метод, URL и код ответа.

## Что запомнить

- Маршрут = метод + путь + handler.
- Данные входят через `request.params` и `request.body`.
- Статус и JSON выходят через `reply.code(...).send(...)`.
- Модуль вешается через `app.register(..., { prefix })`.
