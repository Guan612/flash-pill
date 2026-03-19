import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface QuickCaptureInputProps {
  onSave: (content: string) => Promise<void>
  placeholder?: string
  className?: string
}

export function QuickCaptureInput({
  onSave,
  placeholder = '此刻在想什么？',
  className,
}: QuickCaptureInputProps) {
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!content.trim()) return

    setIsSaving(true)
    try {
      await onSave(content)
      setContent('')
    } catch (err) {
      console.error(err)
      alert('保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={cn('gradient-border rounded-2xl p-4', className)}>
      <Textarea
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px] resize-none border-0 bg-transparent focus:ring-0 text-base"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault()
            handleSave()
          }
        }}
      />
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-[#6366f1]">🎤</span>
          <span>🏷️</span>
          <span className="opacity-50">⌘/Ctrl + Enter 保存</span>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || !content.trim()}
          className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600"
        >
          {isSaving ? '保存中...' : '封存'}
        </Button>
      </div>
    </div>
  )
}
