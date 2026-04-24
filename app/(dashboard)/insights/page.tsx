import { Sparkles, TrendingUp, Wallet, Target } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InsightCard } from '@/components/insights/insight-card'
import { getTransactionStats, getSpendingByCategory } from '@/lib/actions/transactions'
import { getBudgetStats } from '@/lib/actions/budgets'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default async function InsightsPage() {
  const [transactionStats, budgetStats, spendingByCategory] = await Promise.all([
    getTransactionStats(),
    getBudgetStats(),
    getSpendingByCategory(),
  ])

  const { totalIncome, totalExpenses } = transactionStats
  const { totalBudget, totalSpent } = budgetStats

  // Calculate insights
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
  const avgDailySpend = totalExpenses / 30
  const budgetAdherence = totalBudget > 0 ? ((totalBudget - Math.max(totalSpent - totalBudget, 0)) / totalBudget) * 100 : 100

  // Sort spending by category
  const sortedSpending = [...spendingByCategory].sort((a, b) => b.amount - a.amount)
  const totalCategorySpending = sortedSpending.reduce((acc, s) => acc + s.amount, 0)

  // Generate insights based on data
  const insights = [
    {
      id: '1',
      type: 'positive' as const,
      title: savingsRate > 20 ? 'Great Savings Rate!' : 'Room for Improvement',
      description: savingsRate > 20 
        ? `You're saving ${savingsRate.toFixed(1)}% of your income this month. Keep it up!`
        : `Your savings rate is ${savingsRate.toFixed(1)}%. Try to aim for 20% or more.`,
    },
    {
      id: '2',
      type: (budgetAdherence >= 80 ? 'positive' : budgetAdherence >= 50 ? 'warning' : 'negative') as 'positive' | 'warning' | 'negative',
      title: 'Budget Status',
      description: budgetAdherence >= 80 
        ? `You're at ${budgetAdherence.toFixed(0)}% budget adherence. Excellent discipline!`
        : `You're at ${budgetAdherence.toFixed(0)}% budget adherence. Consider reviewing your spending.`,
    },
    {
      id: '3',
      type: 'info' as const,
      title: 'Top Spending Category',
      description: sortedSpending.length > 0 
        ? `${sortedSpending[0].categoryName} is your biggest expense at ${formatCurrency(sortedSpending[0].amount)}.`
        : 'Start tracking expenses to see your top categories.',
    },
    {
      id: '4',
      type: avgDailySpend < 50 ? 'positive' as const : 'warning' as const,
      title: 'Daily Spending',
      description: `You're averaging ${formatCurrency(avgDailySpend)} per day this month.`,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Insights</h1>
          <p className="text-muted-foreground">
            Get personalized insights about your spending habits.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
              <TrendingUp className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Savings Rate</p>
              <p className="text-2xl font-bold">{savingsRate.toFixed(0)}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="size-12 rounded-full bg-success/20 flex items-center justify-center">
              <Wallet className="size-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Daily Spend</p>
              <p className="text-2xl font-bold">{formatCurrency(avgDailySpend)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="size-12 rounded-full bg-warning/20 flex items-center justify-center">
              <Target className="size-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Budget Adherence</p>
              <p className="text-2xl font-bold">{Math.min(budgetAdherence, 100).toFixed(0)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <CardTitle>AI-Powered Insights</CardTitle>
          </div>
          <CardDescription>
            Personalized recommendations based on your spending patterns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spending Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Spending Categories</CardTitle>
            <CardDescription>Where most of your money goes</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedSpending.length > 0 ? (
              <div className="space-y-4">
                {sortedSpending.slice(0, 5).map((category) => {
                  const percent = totalCategorySpending > 0 
                    ? (category.amount / totalCategorySpending) * 100 
                    : 0
                  return (
                    <div key={category.categoryId} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-3 rounded-full"
                            style={{ backgroundColor: category.categoryColor }}
                          />
                          <span>{category.categoryName}</span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(category.amount)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: category.categoryColor,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No spending data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
            <CardDescription>Ways to improve your finances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: 'Reduce dining out',
                  description:
                    'Cooking at home 2 more times per week could save you $120/month.',
                },
                {
                  title: 'Review subscriptions',
                  description:
                    'Consider auditing your recurring expenses for unused services.',
                },
                {
                  title: 'Set up automatic savings',
                  description:
                    'Moving 10% of income to savings could build significant wealth over time.',
                },
                {
                  title: 'Track every expense',
                  description:
                    'Small purchases add up. Logging everything helps identify patterns.',
                },
              ].map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{suggestion.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
