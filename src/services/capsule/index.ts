import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { prisma } from '@/db'
import { capsuleSchema } from '@/types/capsule'
import { auth } from '../auth/config'

export const createCapsule = createServerFn({ method: 'POST' })
  .inputValidator((data: { content: string; openAt?: string }) => data)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()

    // 1. 获取当前登录用户
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw new Error('未登录，无法保存闪念')
    }

    // 2. 存入数据库
    const newCapsule = await prisma.capsule.create({
      data: {
        rawContent: data.content,
        userId: session.user.id,
        openAt: data.openAt ? new Date(data.openAt) : null,
      },
    })

    return { success: true, capsuleId: newCapsule.id }
  })

export const getAllCapsules = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw new Error('未登录，无法获取闪念')
    }

    const capsules = await prisma.capsule.findMany({
      where: { userId: session.user.id },
      include: {
        tags: true,
        attachments: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform Prisma Date objects to ISO strings for Zod validation
    // Zod schemas expect strings, but Prisma returns Date objects
    return capsules.map((capsule) =>
      capsuleSchema.parse({
        ...capsule,
        createdAt: capsule.createdAt.toISOString(),
        updatedAt: capsule.updatedAt.toISOString(),
        openAt: capsule.openAt?.toISOString(),
      }),
    )
  },
)

export const getCapsuleById = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw new Error('未登录，无法获取闪念')
    }

    const capsule = await prisma.capsule.findUnique({
      where: { id: data.id },
      include: {
        tags: true,
        attachments: true,
      },
    })

    if (!capsule || capsule.userId !== session.user.id) {
      throw new Error('闪念不存在或无权访问')
    }

    // Transform Prisma Date objects to ISO strings for Zod validation
    // Zod schemas expect strings, but Prisma returns Date objects
    return capsuleSchema.parse({
      ...capsule,
      createdAt: capsule.createdAt.toISOString(),
      updatedAt: capsule.updatedAt.toISOString(),
      openAt: capsule.openAt?.toISOString(),
    })
  })
