import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { transactions, getCategoryById, formatCurrency, formatDate } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function RecentTransactions() {
  const recentTransactions = transactions.slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest activity</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/transactions">
            View all
            <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => {
            const category = getCategoryById(transaction.categoryId)
            const isIncome = transaction.amount > 0

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="size-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${category?.color}20` }}
                  >
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: category?.color }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    style={{
                      backgroundColor: `${category?.color}20`,
                      color: category?.color,
                    }}
                  >
                    {category?.name}
                  </Badge>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isIncome ? 'text-success' : 'text-foreground'
                    )}
                  >
                    {isIncome ? '+' : ''}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
