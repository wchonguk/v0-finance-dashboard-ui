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

interface Category {
  id: string
  name: string
  color: string
}

interface Budget {
  id: string
  amount: number
  period: string
  categoryId: string
  category: Category
  spent: number
}

interface BudgetFormProps {
  budget?: Budget
  categories: Category[]
  existingCategoryIds: string[]
  onSubmit: (data: {
    categoryId: string
    amount: number
    period: 'monthly' | 'weekly' | 'yearly'
  }) => void
  onCancel: () => void
}

export function BudgetForm({
  budget,
  categories,
  existingCategoryIds,
  onSubmit,
  onCancel,
}: BudgetFormProps) {
  const [categoryId, setCategoryId] = useState(budget?.categoryId ?? '')
  const [amount, setAmount] = useState(budget?.amount.toString() ?? '')
  const [period, setPeriod] = useState<'monthly' | 'weekly' | 'yearly'>(
    (budget?.period as 'monthly' | 'weekly' | 'yearly') ?? 'monthly'
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
      amount: parseFloat(amount),
      period,
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="limit">Budget Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="limit"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-7"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="period">Period</Label>
          <Select value={period} onValueChange={(v) => setPeriod(v as 'monthly' | 'weekly' | 'yearly')}>
            <SelectTrigger id="period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {budget && (
        <div className="rounded-lg bg-muted p-3 text-sm">
          <p className="text-muted-foreground">
            Currently spent:{' '}
            <span className="font-medium text-foreground">
              ${budget.spent.toFixed(2)}
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
