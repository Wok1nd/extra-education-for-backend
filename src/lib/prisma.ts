import { loadEnvFile } from 'node:process'
import { PrismaClient } from '@prisma/client'

try {
  loadEnvFile()
} catch {
  // .env уже может быть загружен через `tsx --env-file` или переменные окружения
}

export const prisma = new PrismaClient()
