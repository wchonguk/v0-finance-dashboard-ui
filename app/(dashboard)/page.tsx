import { Wallet, TrendingDown, TrendingUp, Target } from 'lucide-react'

import { StatCard } from '@/components/dashboard/stat-card'
import { SpendingChart } from '@/components/dashboard/spending-chart'
import { CategoryChart } from '@/components/dashboard/category-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { getTransactionStats, getSpendingOverTime, getSpendingByCategory, getTransactions } from '@/lib/actions/transactions'
import { getBudgetStats } from '@/lib/actions/budgets'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default async function DashboardPage() {
  const [transactionStats, budgetStats, spendingOverTime, spendingByCategory, recentTransactions] = await Promise.all([
    getTransactionStats(),
    getBudgetStats(),
    getSpendingOverTime(30),
    getSpendingByCategory(),
    getTransactions({ limit: 5, sortBy: 'date', sortOrder: 'desc' }),
  ])

  const { totalIncome, totalExpenses, balance } = transactionStats
  const { remaining: remainingBudget, totalBudget } = budgetStats

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your financial overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(balance)}
          icon={<Wallet className="size-4" />}
          trend={{ value: '12.5%', positive: true }}
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp className="size-4" />}
          trend={{ value: '8.2%', positive: true }}
        />
        <StatCard
          title="Monthly Spending"
          value={formatCurrency(totalExpenses)}
          icon={<TrendingDown className="size-4" />}
          trend={{ value: '3.1%', positive: false }}
        />
        <StatCard
          title="Remaining Budget"
          value={formatCurrency(remainingBudget)}
          icon={<Target className="size-4" />}
          description={totalBudget > 0 ? `${((remainingBudget / totalBudget) * 100).toFixed(0)}% of budget remaining` : 'No budgets set'}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingChart data={spendingOverTime} />
        <CategoryChart data={spendingByCategory} />
      </div>

      {/* Quick Actions & Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTransactions transactions={recentTransactions} />
        </div>
        <QuickActions />
      </div>
    </div>
  )
}
