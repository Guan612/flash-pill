import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { BentoGrid } from '@/components/layout/BentoGrid'
import { PageContainer } from '@/components/layout/PageContainer'
import { QuickCaptureInput } from '@/components/capsule/QuickCaptureInput'
import { CapsuleCard } from '@/components/capsule/CapsuleCard'
import { HomeFilters } from '@/components/home/HomeFilters'
import { StatsCard } from '@/components/stats/StatsCard'
import { authClient } from '@/services/auth/client'
import { getAllCapsules, createCapsule } from '@/services/capsule'
import type { Capsule } from '@/types/capsule'

export const Route = createFileRoute('/')({
  component: Home,
})

export function Home() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const {
    data: capsules = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['capsules'],
    queryFn: () => getAllCapsules(),
    enabled: Boolean(session?.user),
  })

  const pattern: Array<
    'large' | 'small' | 'medium' | 'small' | 'small' | 'medium'
  > = ['large', 'small', 'medium', 'small', 'small', 'medium']

  const sizeForIndex = (index: number) => pattern[index % pattern.length]

  const handleSave = async (content: string) => {
    await createCapsule({ data: { content } })
    await queryClient.invalidateQueries({ queryKey: ['capsules'] })
  }

  const totalCapsules = capsules.length
  const thisWeekCapsules = capsules.filter((capsule: Capsule) => {
    const createdAt = new Date(capsule.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return createdAt >= weekAgo
  }).length

  if (isSessionPending || (session?.user && isLoading)) {
    return (
      <PageContainer>
        <section className="space-y-5">
          <div className="space-y-3">
            <div className="h-5 w-40 animate-pulse rounded-full bg-foreground/10" />
            <div className="h-14 w-full animate-pulse rounded-[1.5rem] bg-foreground/8" />
          </div>
          <CapsuleWallSkeleton />
        </section>
      </PageContainer>
    )
  }

  if (!session?.user) {
    return (
      <PageContainer>
        <section className="space-y-6">
          <div className="paper-note-card space-y-4 rounded-[2rem] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5c7e98]">
              贴纸墙
            </p>
            <div className="max-w-3xl space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-[#24455f] sm:text-5xl">
                把每一条闪念，贴成一面轻快又好读的灵感墙。
              </h1>
              <p className="text-sm leading-7 text-[#5c7e98] sm:text-base">
                登录后就能开始记录、整理和回看灵感片段。白天模式会用浅蓝、粉红和白色，把首页做成更像贴纸板的浏览体验。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void navigate({ to: '/auth/login' })}
                className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                登录开始记录
              </button>
              <span className="text-sm text-[#5c7e98]">
                注册后就能建立你的第一面胶囊墙
              </span>
            </div>
          </div>

          <BentoGrid>
            <VisitorGuideCard
              eyebrow="Capture"
              title="先把闪念存下来"
              body="不用先想分类，先让念头有一个安全落点。"
              size="large"
            />
            <VisitorGuideCard
              eyebrow="Organize"
              title="再慢慢整理标签与语境"
              body="等内容累积起来后，再回到详情里延展它。"
              size="medium"
            />
            <VisitorGuideCard
              eyebrow="Recall"
              title="最后形成一面可回看的墙"
              body="登录之后，你的首页就是自己的灵感工作台，而不是公共列表。"
              size="small"
            />
          </BentoGrid>
        </section>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <section className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                贴纸墙
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#24455f] sm:text-4xl">
                把每一条闪念，铺成一面会呼吸的贴纸墙。
              </h1>
            </div>
          </div>

          <HomeFilters />

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <StatsCard label="今日墙面" value={totalCapsules} />
            <StatsCard
              label="本周上墙"
              value={thisWeekCapsules}
              variant="secondary"
            />
          </div>
        </div>

        {isError ? (
          <div
            role="alert"
            className="flex items-center justify-between gap-3 rounded-2xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm"
          >
            <span>加载失败，请重新拉取胶囊墙。</span>
            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded-full border border-destructive/20 px-3 py-1 font-medium"
            >
              重试
            </button>
          </div>
        ) : null}

        <div className="sticky top-[4.5rem] z-30 mb-5">
          <QuickCaptureInput onSave={handleSave} />
        </div>

        <BentoGrid>
          {capsules.length === 0 ? (
            <EmptyGuideCards />
          ) : (
            capsules.map((capsule: Capsule, index: number) => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
                size={sizeForIndex(index)}
                onClick={() =>
                  navigate({ to: '/capsule/$id', params: { id: capsule.id } })
                }
              />
            ))
          )}
        </BentoGrid>
      </section>
    </PageContainer>
  )
}

function CapsuleWallSkeleton() {
  return (
    <BentoGrid>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <div
          key={index}
          className={[
            'paper-note-card animate-pulse rounded-[1.6rem] p-5',
            index === 0 || index === 3
              ? 'col-span-1 row-span-1 sm:row-span-2 lg:col-span-2 lg:row-span-2'
              : index === 2 || index === 5
                ? 'col-span-1 row-span-1 sm:row-span-2'
                : 'col-span-1 row-span-1',
          ].join(' ')}
        >
          <div className="h-4 w-20 rounded-full bg-foreground/10" />
          <div className="mt-4 h-6 w-3/4 rounded-full bg-foreground/10" />
          <div className="mt-3 h-20 rounded-2xl bg-foreground/8" />
        </div>
      ))}
    </BentoGrid>
  )
}

function EmptyGuideCards() {
  const placeholders = [
    {
      title: '从一条未整理的闪念开始',
      body: '记录刚冒出来的念头，首页会自动刷新，把它放进策展墙第一屏。',
      size: 'large' as const,
    },
    {
      title: '把标签先留给之后',
      body: '现在只需要先封存，后面再慢慢给它分类、发酵和展开。',
      size: 'medium' as const,
    },
    {
      title: '点开卡片继续整理',
      body: '每张卡片都可以直接进入详情页，回到当时的语境。',
      size: 'small' as const,
    },
  ]

  return placeholders.map((item) => (
    <article
      key={item.title}
      className={[
        'paper-note-card flex h-full flex-col justify-between rounded-[1.6rem] border border-dashed border-[#5BCEFA]/35 p-5 text-[#5c7e98]',
        item.size === 'large'
          ? 'col-span-1 row-span-1 sm:row-span-2 lg:col-span-2 lg:row-span-2'
          : item.size === 'medium'
            ? 'col-span-1 row-span-1 sm:row-span-2'
            : 'col-span-1 row-span-1',
      ].join(' ')}
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5c7e98]">
          Empty Rhythm
        </p>
        <h2 className="mt-4 text-xl font-semibold text-[#24455f]">
          {item.title}
        </h2>
      </div>
      <p className="mt-4 text-sm leading-6">{item.body}</p>
    </article>
  ))
}

function VisitorGuideCard({
  eyebrow,
  title,
  body,
  size,
}: {
  eyebrow: string
  title: string
  body: string
  size: 'large' | 'medium' | 'small'
}) {
  return (
    <article
      className={[
        'paper-note-card flex h-full flex-col justify-between rounded-[1.6rem] p-5 text-[#5c7e98]',
        size === 'large'
          ? 'col-span-1 row-span-1 sm:row-span-2 lg:col-span-2 lg:row-span-2'
          : size === 'medium'
            ? 'col-span-1 row-span-1 sm:row-span-2'
            : 'col-span-1 row-span-1',
      ].join(' ')}
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5c7e98]">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-xl font-semibold text-[#24455f]">{title}</h2>
      </div>
      <p className="mt-4 text-sm leading-6">{body}</p>
    </article>
  )
}
