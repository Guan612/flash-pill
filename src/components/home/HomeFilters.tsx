import * as React from 'react'
import { Check, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const FILTER_OPTIONS = ['最新封存', '灵感', '待展开', '有标签']

interface HomeFiltersProps {
  className?: string
}

interface HomeFiltersState {
  open: boolean
  selected: string[]
}

export class HomeFilters extends React.Component<
  HomeFiltersProps,
  HomeFiltersState
> {
  state: HomeFiltersState = {
    open: false,
    selected: [],
  }

  toggleOption = (option: string) => {
    this.setState((current) => ({
      selected: current.selected.includes(option)
        ? current.selected.filter((item) => item !== option)
        : [...current.selected, option],
    }))
  }

  render() {
    const { className } = this.props
    const { open, selected } = this.state

    return (
      <div
        className={cn(
          'paper-note-card rounded-[1.6rem] p-3 shadow-sm',
          className,
        )}
      >
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-sm font-medium text-[#5c7e98]">贴纸筛选</span>
          {FILTER_OPTIONS.map((option) => {
            const active = selected.includes(option)

            return (
              <button
                key={option}
                type="button"
                onClick={() => this.toggleOption(option)}
                aria-pressed={active}
                className={cn(
                  'paper-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors cursor-pointer',
                  active
                    ? 'border-[#5BCEFA]/45 bg-[linear-gradient(135deg,rgba(91,206,250,0.2),rgba(245,169,184,0.18))] text-[#24455f] shadow-[0_8px_18px_rgba(91,206,250,0.12)]'
                    : 'text-[#5c7e98] hover:border-[#F5A9B8]/55 hover:text-[#24455f]',
                )}
              >
                {active ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : null}
                {option}
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between sm:hidden">
          <span className="text-sm font-medium text-[#5c7e98]">贴纸筛选</span>
          <Button
            type="button"
            variant="outline"
            onClick={() => this.setState({ open: true })}
            className="rounded-full border-[#5BCEFA]/35 bg-white/90 text-[#24455f] shadow-[0_10px_22px_rgba(91,206,250,0.1)]"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            筛选
          </Button>
        </div>

        {open ? (
          <div className="fixed inset-0 z-40 flex items-end bg-black/30 sm:hidden">
            <div
              role="dialog"
              aria-modal="true"
              aria-label="筛选视图"
              className="w-full rounded-t-[2rem] bg-white/98 p-4 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#24455f]">筛选视图</p>
                  <p className="text-xs text-[#5c7e98]">
                    仅切换 UI 状态，不影响数据
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => this.setState({ open: false })}
                  aria-label="关闭筛选面板"
                >
                  <X className="size-4" aria-hidden="true" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.map((option) => {
                  const active = selected.includes(option)

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => this.toggleOption(option)}
                      aria-pressed={active}
                      className={cn(
                        'paper-chip rounded-full px-3 py-2 text-sm transition-colors cursor-pointer',
                        active
                          ? 'border-[#F5A9B8]/60 bg-[linear-gradient(135deg,rgba(245,169,184,0.26),rgba(91,206,250,0.16))] text-[#24455f]'
                          : 'text-[#5c7e98] hover:border-[#5BCEFA]/45',
                      )}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}
