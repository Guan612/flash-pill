import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { createCapsule } from '@/services/capsule'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [content, setContent] = useState('')

  const handleSave = async () => {
    try {
      await createCapsule({ data: { content } })
      alert('闪念已封存！')
      setContent('')
    } catch (err) {
      console.error(err)
      alert('保存失败，请检查是否登录')
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-8">
      <h1 className="text-2xl font-bold">闪念胶囊 🚀</h1>
      <Textarea
        placeholder="此刻在想什么？"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button onClick={handleSave} className="w-full">
        封存这个瞬间
      </Button>
    </div>
  )
}
