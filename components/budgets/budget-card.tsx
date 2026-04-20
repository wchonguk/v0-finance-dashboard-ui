'use client'

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getCategoryById, formatCurrency } from '@/lib/mock-data'
import type { Budget } from '@/lib/types'
import { cn } from '@/lib/utils'

interface BudgetCardProps {
  budget: Budget
  onEdit: (budget: Budget) => void
  onDelete: (id: string) => void
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const category = getCategoryById(budget.categoryId)
  const percentUsed = (budget.spent / budget.monthlyLimit) * 100
  const remaining = budget.monthlyLimit - budget.spent

  const getProgressColor = () => {
    if (percentUsed >= 90) return 'bg-destructive'
    if (percentUsed >= 70) return 'bg-warning'
    return 'bg-success'
  }

  const getStatusText = () => {
    if (percentUsed >= 100) return 'Over budget'
    if (percentUsed >= 90) return 'Almost at limit'
    if (percentUsed >= 70) return 'Approaching limit'
    return 'On track'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div
            className="size-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${category?.color}20` }}
          >
            <div
              className="size-4 rounded-full"
              style={{ backgroundColor: category?.color }}
            />
          </div>
          <div>
            <h3 className="font-semibold">{category?.name}</h3>
            <p
              className={cn(
                'text-xs',
                percentUsed >= 90 ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              {getStatusText()}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(budget)}>
              <Pencil className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(budget.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent</span>
            <span className="font-medium">
              {formatCurrency(budget.spent)} of {formatCurrency(budget.monthlyLimit)}
            </span>
          </div>
          <div className="relative">
            <Progress value={Math.min(percentUsed, 100)} className="h-2" />
            <div
              className={cn(
                'absolute inset-0 h-2 rounded-full transition-all',
                getProgressColor()
              )}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Remaining</span>
          <span
            className={cn(
              'font-medium',
              remaining < 0 ? 'text-destructive' : 'text-success'
            )}
          >
            {formatCurrency(Math.max(remaining, 0))}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
