import Fastify from 'fastify'
import { usersRoutes } from './modules/users/users.routes'

export function buildApp() {
  const app = Fastify({ logger: true })

  app.get('/health', async () => {
    return { ok: true }
  })

  app.register(usersRoutes, { prefix: '/users' })

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error)
    return reply.code(500).send({ message: 'Internal Server Error' })
  })

  return app
}
