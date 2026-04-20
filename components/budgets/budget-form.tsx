'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { categories, getCategoryById } from '@/lib/mock-data'
import type { Budget } from '@/lib/types'

interface BudgetFormProps {
  budget?: Budget
  existingCategoryIds: string[]
  onSubmit: (data: Omit<Budget, 'id' | 'spent'>) => void
  onCancel: () => void
}

export function BudgetForm({
  budget,
  existingCategoryIds,
  onSubmit,
  onCancel,
}: BudgetFormProps) {
  const [categoryId, setCategoryId] = useState(budget?.categoryId ?? '')
  const [monthlyLimit, setMonthlyLimit] = useState(
    budget?.monthlyLimit.toString() ?? ''
  )

  // Filter out categories that already have budgets (unless editing)
  const availableCategories = categories.filter(
    (c) =>
      c.id === budget?.categoryId ||
      (!existingCategoryIds.includes(c.id) && c.name !== 'Income')
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      categoryId,
      monthlyLimit: parseFloat(monthlyLimit),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={categoryId}
          onValueChange={setCategoryId}
          disabled={!!budget}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {availableCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {budget && (
          <p className="text-xs text-muted-foreground">
            Category cannot be changed when editing a budget.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="limit">Monthly Limit</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            £
          </span>
          <Input
            id="limit"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value)}
            className="pl-7"
            required
          />
        </div>
      </div>

      {budget && (
        <div className="rounded-lg bg-muted p-3 text-sm">
          <p className="text-muted-foreground">
            Currently spent:{' '}
            <span className="font-medium text-foreground">
              £{budget.spent.toFixed(2)}
            </span>
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {budget ? 'Update' : 'Create'} Budget
        </Button>
      </div>
    </form>
  )
}
