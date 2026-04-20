'use client'

import { useState } from 'react'
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
import { budgets as mockBudgets, formatCurrency } from '@/lib/mock-data'
import type { Budget } from '@/lib/types'

export default function BudgetsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editBudget, setEditBudget] = useState<Budget | null>(null)

  const existingCategoryIds = mockBudgets.map((b) => b.categoryId)

  const totalBudget = mockBudgets.reduce((acc, b) => acc + b.monthlyLimit, 0)
  const totalSpent = mockBudgets.reduce((acc, b) => acc + b.spent, 0)
  const totalRemaining = totalBudget - totalSpent

  const handleAddBudget = (data: Omit<Budget, 'id' | 'spent'>) => {
    // In a real app, this would call an API
    console.log('Add budget:', data)
    setIsAddDialogOpen(false)
  }

  const handleEditBudget = (data: Omit<Budget, 'id' | 'spent'>) => {
    // In a real app, this would call an API
    console.log('Update budget:', { id: editBudget?.id, ...data })
    setEditBudget(null)
  }

  const handleDeleteBudget = (id: string) => {
    // In a real app, this would call an API
    console.log('Delete budget:', id)
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
            <Button>
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
      {mockBudgets.length === 0 ? (
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
          {mockBudgets.map((budget) => (
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
