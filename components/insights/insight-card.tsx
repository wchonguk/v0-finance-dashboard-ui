import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Info,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Insight {
  id: string
  type: 'positive' | 'negative' | 'warning' | 'info'
  title: string
  description: string
}

interface InsightCardProps {
  insight: Insight
}

export function InsightCard({ insight }: InsightCardProps) {
  const getTypeConfig = () => {
    switch (insight.type) {
      case 'positive':
        return {
          Icon: TrendingUp,
          bgColor: 'bg-success/10',
          iconColor: 'text-success',
          borderColor: 'border-success/20',
        }
      case 'negative':
        return {
          Icon: TrendingDown,
          bgColor: 'bg-destructive/10',
          iconColor: 'text-destructive',
          borderColor: 'border-destructive/20',
        }
      case 'warning':
        return {
          Icon: AlertTriangle,
          bgColor: 'bg-warning/10',
          iconColor: 'text-warning',
          borderColor: 'border-warning/20',
        }
      case 'info':
      default:
        return {
          Icon: Info,
          bgColor: 'bg-primary/10',
          iconColor: 'text-primary',
          borderColor: 'border-primary/20',
        }
    }
  }

  const { Icon, bgColor, iconColor, borderColor } = getTypeConfig()

  return (
    <Card className={cn('border-l-4', borderColor)}>
      <CardContent className="flex items-start gap-4 p-4">
        <div
          className={cn(
            'size-10 rounded-full flex items-center justify-center shrink-0',
            bgColor
          )}
        >
          <Icon className={cn('size-5', iconColor)} />
        </div>
        <div>
          <h3 className="font-medium">{insight.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {insight.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
