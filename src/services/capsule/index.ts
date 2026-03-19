import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { prisma } from '@/db' // 你的 Prisma 实例
import { auth } from '@/lib/auth' // 你的 Better Auth 实例

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

export const findAllCapsule = createServerFn({ method: 'GET' }).handler(
  async () => {},
)
