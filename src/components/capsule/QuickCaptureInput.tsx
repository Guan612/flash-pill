import * as React from 'react'
import { Mic, Sparkles, Tags, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface QuickCaptureInputProps {
  onSave: (content: string) => Promise<void>
  placeholder?: string
  className?: string
}

type Feedback = { type: 'success' | 'error'; text: string } | null

interface QuickCaptureInputState {
  content: string
  isSaving: boolean
  isDesktopExpanded: boolean
  isMobileOpen: boolean
  feedback: Feedback
}

export class QuickCaptureInput extends React.Component<
  QuickCaptureInputProps,
  QuickCaptureInputState
> {
  state: QuickCaptureInputState = {
    content: '',
    isSaving: false,
    isDesktopExpanded: false,
    isMobileOpen: false,
    feedback: null,
  }

  handleSave = async () => {
    const { content } = this.state

    if (!content.trim()) return

    this.setState({ isSaving: true, feedback: null })

    try {
      await this.props.onSave(content)
      this.setState({
        content: '',
        feedback: { type: 'success', text: '已封存到胶囊墙' },
      })
    } catch {
      this.setState({
        feedback: { type: 'error', text: '保存失败，当前内容已保留' },
      })
    } finally {
      this.setState({ isSaving: false })
    }
  }

  openDesktopComposer = () => {
    this.setState({ isDesktopExpanded: true, feedback: null })
  }

  openMobileComposer = () => {
    this.setState({ isMobileOpen: true, feedback: null })
  }

  closeMobileComposer = () => {
    this.setState({ isMobileOpen: false })
  }

  renderComposer(variant: 'desktop' | 'mobile') {
    const { placeholder = '此刻在想什么？' } = this.props
    const { content, feedback, isSaving } = this.state
    const isMobile = variant === 'mobile'

    return (
      <div
        className={cn(
          'paper-note-card rounded-[1.6rem] p-4 shadow-sm',
          isMobile && 'border-0 bg-transparent p-0 shadow-none',
        )}
      >
        <Textarea
          placeholder={placeholder}
          value={content}
          onChange={(e) => this.setState({ content: e.target.value })}
          className={cn(
            'min-h-[120px] resize-none text-base',
            isMobile && 'min-h-[180px]',
          )}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault()
              void this.handleSave()
            }
          }}
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-[#5c7e98]">
            <span className="inline-flex items-center gap-1">
              <Mic className="size-4" aria-hidden="true" />
              <span>语音</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Tags className="size-4" aria-hidden="true" />
              <span>标签</span>
            </span>
            <span className="inline-flex items-center gap-1 opacity-70">
              <Sparkles className="size-4" aria-hidden="true" />
              <span>封存灵感</span>
            </span>
          </div>

          <Button
            onClick={() => void this.handleSave()}
            disabled={isSaving || !content.trim()}
          >
            {isSaving ? '保存中...' : '封存'}
          </Button>
        </div>

        {feedback ? (
          <p
            className={cn(
              'mt-3 text-sm',
              feedback.type === 'success'
                ? 'text-emerald-600'
                : 'text-destructive',
            )}
            role={feedback.type === 'error' ? 'alert' : undefined}
          >
            {feedback.text}
          </p>
        ) : null}
      </div>
    )
  }

  render() {
    const { className } = this.props
    const { isDesktopExpanded, isMobileOpen } = this.state

    return (
      <div className={cn('relative', className)}>
        <div className="gradient-border rounded-2xl p-4">
          {isDesktopExpanded ? (
            this.renderComposer('desktop')
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={this.openDesktopComposer}
            >
              <Sparkles className="size-4" aria-hidden="true" />
              记录闪念
            </Button>
          )}
        </div>

        <Button
          type="button"
          size="icon-lg"
          className="fixed bottom-6 right-6 rounded-full border border-[#F5A9B8]/55 bg-[linear-gradient(135deg,#5BCEFA,#F5A9B8)] text-white shadow-[0_18px_36px_rgba(91,206,250,0.24)] md:hidden"
          onClick={this.openMobileComposer}
          aria-label="打开移动端记录面板"
        >
          <Mic className="size-5" aria-hidden="true" />
        </Button>

        {isMobileOpen ? (
          <div className="fixed inset-0 z-50 flex items-end bg-black/30 md:hidden">
            <div
              role="dialog"
              aria-modal="true"
              aria-label="快速记录面板"
              className="w-full rounded-t-[2rem] bg-white/98 p-4 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-[#5c7e98]">
                  快速记录面板
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={this.closeMobileComposer}
                  aria-label="关闭记录面板"
                >
                  <X className="size-4" aria-hidden="true" />
                </Button>
              </div>

              {this.renderComposer('mobile')}
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}
