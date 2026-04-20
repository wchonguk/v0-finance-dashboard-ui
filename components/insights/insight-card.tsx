import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CreditCard,
  Utensils,
  PiggyBank,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import type { InsightCard as InsightCardType } from '@/lib/types'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'utensils': Utensils,
  'credit-card': CreditCard,
  'piggy-bank': PiggyBank,
  'alert-triangle': AlertTriangle,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
}

interface InsightCardProps {
  insight: InsightCardType
}

export function InsightCard({ insight }: InsightCardProps) {
  const IconComponent = iconMap[insight.icon] || AlertTriangle

  const getTypeStyles = () => {
    switch (insight.type) {
      case 'positive':
        return {
          bgColor: 'bg-success/10',
          iconColor: 'text-success',
          borderColor: 'border-success/20',
        }
      case 'negative':
        return {
          bgColor: 'bg-destructive/10',
          iconColor: 'text-destructive',
          borderColor: 'border-destructive/20',
        }
      default:
        return {
          bgColor: 'bg-warning/10',
          iconColor: 'text-warning',
          borderColor: 'border-warning/20',
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <Card className={cn('border-l-4', styles.borderColor)}>
      <CardContent className="flex items-start gap-4 p-4">
        <div
          className={cn(
            'size-10 rounded-full flex items-center justify-center shrink-0',
            styles.bgColor
          )}
        >
          <IconComponent className={cn('size-5', styles.iconColor)} />
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
