'use client'

import { useState, useTransition } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { BudgetCard } from '@/components/budgets/budget-card'
import { BudgetForm } from '@/components/budgets/budget-form'
import { createBudget, updateBudget, deleteBudget } from '@/lib/actions/budgets'

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

interface BudgetsClientProps {
  initialBudgets: Budget[]
  categories: Category[]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function BudgetsClient({ initialBudgets, categories }: BudgetsClientProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editBudget, setEditBudget] = useState<Budget | null>(null)
  const [isPending, startTransition] = useTransition()

  const existingCategoryIds = initialBudgets.map((b) => b.categoryId)

  const totalBudget = initialBudgets.reduce((acc, b) => acc + b.amount, 0)
  const totalSpent = initialBudgets.reduce((acc, b) => acc + b.spent, 0)
  const totalRemaining = totalBudget - totalSpent

  const handleAddBudget = async (data: {
    categoryId: string
    amount: number
    period: 'monthly' | 'weekly' | 'yearly'
  }) => {
    startTransition(async () => {
      await createBudget(data)
      setIsAddDialogOpen(false)
    })
  }

  const handleEditBudget = async (data: {
    categoryId: string
    amount: number
    period: 'monthly' | 'weekly' | 'yearly'
  }) => {
    if (editBudget) {
      startTransition(async () => {
        await updateBudget(editBudget.id, data)
        setEditBudget(null)
      })
    }
  }

  const handleDeleteBudget = async (id: string) => {
    startTransition(async () => {
      await deleteBudget(id)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">
            Set and manage your monthly spending limits.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={isPending}>
              <Plus className="mr-2 size-4" />
              Create Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Budget</DialogTitle>
              <DialogDescription>
                Set a monthly spending limit for a category.
              </DialogDescription>
            </DialogHeader>
            <BudgetForm
              categories={categories}
              existingCategoryIds={existingCategoryIds}
              onSubmit={handleAddBudget}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Budget</p>
          <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Spent</p>
          <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Remaining</p>
          <p className="text-2xl font-bold text-success">
            {formatCurrency(totalRemaining)}
          </p>
        </div>
      </div>

      {/* Budget Cards Grid */}
      {initialBudgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-lg font-medium">No budgets yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first budget to start tracking your spending.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialBudgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={setEditBudget}
              onDelete={handleDeleteBudget}
            />
          ))}
        </div>
      )}

      {/* Edit Budget Dialog */}
      <Dialog open={!!editBudget} onOpenChange={() => setEditBudget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>
              Update your monthly spending limit.
            </DialogDescription>
          </DialogHeader>
          {editBudget && (
            <BudgetForm
              budget={editBudget}
              categories={categories}
              existingCategoryIds={existingCategoryIds}
              onSubmit={handleEditBudget}
              onCancel={() => setEditBudget(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
