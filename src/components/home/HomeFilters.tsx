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
          'rounded-2xl border border-border/60 bg-background/80 p-3 shadow-sm',
          className,
        )}
      >
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-sm font-medium text-muted-foreground">
            浏览视角
          </span>
          {FILTER_OPTIONS.map((option) => {
            const active = selected.includes(option)

            return (
              <button
                key={option}
                type="button"
                onClick={() => this.toggleOption(option)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors',
                  active
                    ? 'border-indigo-400/40 bg-indigo-500/10 text-foreground'
                    : 'border-border/60 bg-background/70 text-muted-foreground hover:text-foreground',
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
          <span className="text-sm font-medium text-muted-foreground">
            浏览视角
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={() => this.setState({ open: true })}
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            筛选
          </Button>
        </div>

        {open ? (
          <div className="fixed inset-0 z-40 flex items-end bg-black/30 sm:hidden">
            <div className="w-full rounded-t-3xl bg-background p-4 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">筛选视图</p>
                  <p className="text-xs text-muted-foreground">
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
                      className={cn(
                        'rounded-full border px-3 py-2 text-sm transition-colors',
                        active
                          ? 'border-pink-400/50 bg-pink-500/10 text-foreground'
                          : 'border-border/60 bg-background/70 text-muted-foreground',
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
