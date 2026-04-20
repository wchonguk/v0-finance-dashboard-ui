import { Wallet, TrendingDown, TrendingUp, Target } from 'lucide-react'

import { StatCard } from '@/components/dashboard/stat-card'
import { SpendingChart } from '@/components/dashboard/spending-chart'
import { CategoryChart } from '@/components/dashboard/category-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { transactions, budgets, formatCurrency } from '@/lib/mock-data'

export default function DashboardPage() {
  // Calculate summary statistics
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0)
  
  const totalExpenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0)
  
  const totalBalance = totalIncome - totalExpenses
  
  const totalBudget = budgets.reduce((acc, b) => acc + b.monthlyLimit, 0)
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0)
  const remainingBudget = totalBudget - totalSpent

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
          value={formatCurrency(totalBalance)}
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
          description={`${((remainingBudget / totalBudget) * 100).toFixed(0)}% of budget remaining`}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingChart />
        <CategoryChart />
      </div>

      {/* Quick Actions & Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <QuickActions />
      </div>
    </div>
  )
}
