import type { FastifyInstance } from 'fastify'
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from './users.handlers'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', listUsers)
  app.get('/:id', getUser)
  app.post('/', createUser)
  app.patch('/:id', updateUser)
  app.delete('/:id', deleteUser)
}
