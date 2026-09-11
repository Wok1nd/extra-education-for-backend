import type { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../lib/prisma'

export async function listUsers(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return reply.code(200).send(users)
}

export async function getUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const user = await prisma.user.findUnique({
    where: { id: request.params.id },
  })

  if (!user) {
    return reply.code(404).send({ message: 'User not found' })
  }

  return reply.code(200).send(user)
}

type CreateUserBody = {
  email?: string
  name?: string
}

export async function createUser(
  request: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply,
) {
  const { email, name } = request.body ?? {}

  if (!email || !name) {
    return reply.code(400).send({ message: 'email and name are required' })
  }

  const user = await prisma.user.create({
    data: { email, name },
  })

  return reply.code(201).send(user)
}

type UpdateUserBody = {
  email?: string
  name?: string
}

export async function updateUser(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateUserBody }>,
  reply: FastifyReply,
) {
  const existing = await prisma.user.findUnique({
    where: { id: request.params.id },
  })

  if (!existing) {
    return reply.code(404).send({ message: 'User not found' })
  }

  const { email, name } = request.body ?? {}

  const user = await prisma.user.update({
    where: { id: request.params.id },
    data: {
      ...(email !== undefined ? { email } : {}),
      ...(name !== undefined ? { name } : {}),
    },
  })

  return reply.code(200).send(user)
}

export async function deleteUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const existing = await prisma.user.findUnique({
    where: { id: request.params.id },
  })

  if (!existing) {
    return reply.code(404).send({ message: 'User not found' })
  }

  await prisma.user.delete({
    where: { id: request.params.id },
  })

  return reply.code(204).send()
}
