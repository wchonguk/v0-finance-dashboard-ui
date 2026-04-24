'use client'

import { useState, useMemo, useTransition } from 'react'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { TransactionsTable } from '@/components/transactions/transactions-table'
import { createTransaction, updateTransaction, deleteTransaction } from '@/lib/actions/transactions'

interface Category {
  id: string
  name: string
  color: string
  _count?: { transactions: number }
}

interface Transaction {
  id: string
  description: string
  amount: number
  type: string
  date: Date
  categoryId: string
  category: Category | null
}

interface TransactionsClientProps {
  initialTransactions: Transaction[]
  categories: Category[]
}

export function TransactionsClient({ initialTransactions, categories }: TransactionsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const filteredTransactions = useMemo(() => {
    let result = [...initialTransactions]

    // Filter by search query
    if (searchQuery) {
      result = result.filter((t) =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.categoryId === categoryFilter)
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      } else {
        return sortOrder === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount
      }
    })

    return result
  }, [initialTransactions, searchQuery, categoryFilter, sortBy, sortOrder])

  const handleAddTransaction = async (data: {
    description: string
    amount: number
    type: 'income' | 'expense'
    date: Date
    categoryId: string
  }) => {
    startTransition(async () => {
      await createTransaction(data)
      setIsAddDialogOpen(false)
    })
  }

  const handleEditTransaction = async (id: string, data: {
    description?: string
    amount?: number
    type?: 'income' | 'expense'
    date?: Date
    categoryId?: string
  }) => {
    startTransition(async () => {
      await updateTransaction(id, data)
    })
  }

  const handleDeleteTransaction = async (id: string) => {
    startTransition(async () => {
      await deleteTransaction(id)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage and track all your transactions.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={isPending}>
              <Plus className="mr-2 size-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>
                Enter the details of your new transaction.
              </DialogDescription>
            </DialogHeader>
            <TransactionForm
              categories={categories}
              onSubmit={handleAddTransaction}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
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

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Sort by</Label>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'amount')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Order</Label>
                  <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'asc' | 'desc')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Newest first</SelectItem>
                      <SelectItem value="asc">Oldest first</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredTransactions.length} of {initialTransactions.length} transactions
      </p>

      {/* Table */}
      <TransactionsTable 
        transactions={filteredTransactions} 
        categories={categories}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />
    </div>
  )
}
