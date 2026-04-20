'use client'

import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TransactionForm } from './transaction-form'
import { getCategoryById, formatCurrency, formatDate } from '@/lib/mock-data'
import type { Transaction } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TransactionsTableProps {
  transactions: Transaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null)

  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction)
  }

  const handleDelete = (id: string) => {
    // In a real app, this would call an API
    console.log('Delete transaction:', id)
  }

  const handleUpdate = (data: Omit<Transaction, 'id'>) => {
    // In a real app, this would call an API
    console.log('Update transaction:', { id: editTransaction?.id, ...data })
    setEditTransaction(null)
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="text-lg font-medium">No transactions yet</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Start by adding your first transaction.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              const category = getCategoryById(transaction.categoryId)
              const isIncome = transaction.amount > 0

              return (
                <TableRow key={transaction.id}>
                  <TableCell className="text-muted-foreground">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.description}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: `${category?.color}20`,
                        color: category?.color,
                      }}
                    >
                      {category?.name}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-medium',
                      isIncome ? 'text-success' : ''
                    )}
                  >
                    {isIncome ? '+' : ''}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                          <Pencil className="mr-2 size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(transaction.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editTransaction} onOpenChange={() => setEditTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Make changes to your transaction.
            </DialogDescription>
          </DialogHeader>
          {editTransaction && (
            <TransactionForm
              transaction={editTransaction}
              onSubmit={handleUpdate}
              onCancel={() => setEditTransaction(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
