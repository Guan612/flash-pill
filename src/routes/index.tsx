import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { BentoGrid } from '@/components/layout/BentoGrid'
import { PageContainer } from '@/components/layout/PageContainer'
import { QuickCaptureInput } from '@/components/capsule/QuickCaptureInput'
import { CapsuleCard } from '@/components/capsule/CapsuleCard'
import { HomeFilters } from '@/components/home/HomeFilters'
import { StatsCard } from '@/components/stats/StatsCard'
import { getAllCapsules, createCapsule } from '@/services/capsule'
import type { Capsule } from '@/types/capsule'

export const Route = createFileRoute('/')({
  component: Home,
})

export function Home() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const {
    data: capsules = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['capsules'],
    queryFn: () => getAllCapsules(),
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

  if (isLoading) {
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

  return (
    <PageContainer>
      <section className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Curation Wall
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                把每一条闪念，铺成一面可回看的策展墙。
              </h1>
            </div>
          </div>

          <HomeFilters />

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <StatsCard label="总胶囊" value={totalCapsules} />
            <StatsCard
              label="本周新增"
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
            'bg-glass animate-pulse rounded-[1.4rem] p-5',
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
        'bg-glass flex h-full flex-col justify-between rounded-[1.4rem] border border-dashed border-border/70 p-5 text-muted-foreground',
        item.size === 'large'
          ? 'col-span-1 row-span-1 sm:row-span-2 lg:col-span-2 lg:row-span-2'
          : item.size === 'medium'
            ? 'col-span-1 row-span-1 sm:row-span-2'
            : 'col-span-1 row-span-1',
      ].join(' ')}
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
          Empty Rhythm
        </p>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          {item.title}
        </h2>
      </div>
      <p className="mt-4 text-sm leading-6">{item.body}</p>
    </article>
  ))
}
