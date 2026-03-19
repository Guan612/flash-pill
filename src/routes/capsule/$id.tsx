import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BentoGrid } from '@/components/layout/BentoGrid'
import { PageContainer } from '@/components/layout/PageContainer'
import { CapsuleStatus } from '@/components/capsule/CapsuleStatus'
import { TagBadge } from '@/components/tags/TagBadge'
import { getCapsuleById } from '@/services/capsule'

export const Route = createFileRoute('/capsule/$id')({
  component: CapsuleDetail,
})

function CapsuleDetail() {
  const { id } = Route.useParams()
  const { data: capsule, isLoading } = useQuery({
    queryKey: ['capsule', id],
    queryFn: () => getCapsuleById({ data: { id } }),
  })

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-muted-foreground">加载中...</div>
        </div>
      </PageContainer>
    )
  }

  if (!capsule) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-muted-foreground">胶囊不存在</div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        ← 返回首页
      </Link>

      <BentoGrid>
        <div className="col-span-1 bg-glass rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold">{capsule.title || '无标题'}</h1>
            <CapsuleStatus status={capsule.status} />
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            创建于: {new Date(capsule.createdAt).toLocaleString()}
          </div>

          {capsule.mood && (
            <div className="text-sm text-muted-foreground mb-2">
              心情: {capsule.mood}
            </div>
          )}

          {capsule.location && (
            <div className="text-sm text-muted-foreground mb-4">
              地点: {capsule.location}
            </div>
          )}

          <div className="prose prose-sm max-w-none">
            {capsule.refinedContent || capsule.rawContent}
          </div>

          {capsule.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {capsule.tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          )}
        </div>

        <div className="col-span-2 bg-glass rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">关联胶囊</h2>
          <div className="text-muted-foreground">
            暂无关联胶囊（功能开发中）
          </div>

          <h2 className="text-xl font-bold mb-4 mt-8">AI 分析</h2>
          <div className="text-muted-foreground">AI 分析功能开发中</div>
        </div>
      </BentoGrid>
    </PageContainer>
  )
}
