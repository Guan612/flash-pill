import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { BentoGrid } from '@/components/layout/BentoGrid'
import { PageContainer } from '@/components/layout/PageContainer'
import { QuickCaptureInput } from '@/components/capsule/QuickCaptureInput'
import { CapsuleCard } from '@/components/capsule/CapsuleCard'
import { StatsCard } from '@/components/stats/StatsCard'
import { getAllCapsules, createCapsule } from '@/services/capsule'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const queryClient = useQueryClient()
  const { data: capsules = [] } = useQuery({
    queryKey: ['capsules'],
    queryFn: () => getAllCapsules(),
  })

  const handleSave = async (content: string) => {
    await createCapsule({ data: { content } })
    await queryClient.invalidateQueries({ queryKey: ['capsules'] })
  }

  const totalCapsules = capsules.length
  const thisWeekCapsules = capsules.filter((c: any) => {
    const createdAt = new Date(c.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return createdAt >= weekAgo
  }).length

  return (
    <PageContainer>
      <BentoGrid>
        <QuickCaptureInput onSave={handleSave} className="col-span-full" />

        <StatsCard
          label="总胶囊"
          value={totalCapsules}
          className="col-span-1"
        />

        <StatsCard
          label="本周新增"
          value={thisWeekCapsules}
          variant="secondary"
          className="col-span-1"
        />

        {capsules.map((capsule: any, index: number) => (
          <CapsuleCard
            key={capsule.id}
            capsule={capsule}
            size={
              index % 3 === 0 ? 'large' : index % 2 === 0 ? 'medium' : 'small'
            }
            onClick={() => (window.location.href = `/capsule/${capsule.id}`)}
          />
        ))}
      </BentoGrid>
    </PageContainer>
  )
}
