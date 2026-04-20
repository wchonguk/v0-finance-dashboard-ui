'use client'

import { useState } from 'react'
import { Sparkles, RefreshCw, TrendingUp, Wallet, Target } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { InsightCard } from '@/components/insights/insight-card'
import { insights as mockInsights, formatCurrency } from '@/lib/mock-data'

export default function InsightsPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateInsights = () => {
    setIsLoading(true)
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Insights</h1>
          <p className="text-muted-foreground">
            Get personalized insights about your spending habits.
          </p>
        </div>
        <Button onClick={handleGenerateInsights} disabled={isLoading}>
          {isLoading ? (
            <RefreshCw className="mr-2 size-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 size-4" />
          )}
          Generate Insights
        </Button>
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
              <p className="text-2xl font-bold">23%</p>
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
              <p className="text-2xl font-bold">{formatCurrency(54.32)}</p>
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
              <p className="text-2xl font-bold">78%</p>
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
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="size-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {mockInsights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          )}
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
            <div className="space-y-4">
              {[
                { name: 'Shopping', amount: 245.80, percent: 30, color: '#f59e0b' },
                { name: 'Bills & Utilities', amount: 199.99, percent: 25, color: '#ef4444' },
                { name: 'Food & Dining', amount: 162.90, percent: 20, color: '#22c55e' },
                { name: 'Health', amount: 82.49, percent: 10, color: '#06b6d4' },
                { name: 'Transportation', amount: 69.30, percent: 8, color: '#3b82f6' },
              ].map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(category.amount)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${category.percent}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
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
                    'Cooking at home 2 more times per week could save you £120/month.',
                },
                {
                  title: 'Review subscriptions',
                  description:
                    'You have 3 unused subscriptions totaling £45/month.',
                },
                {
                  title: 'Set up automatic savings',
                  description:
                    'Moving 10% of income to savings could build £620/year.',
                },
                {
                  title: 'Consolidate shopping trips',
                  description:
                    'Fewer trips could reduce impulse purchases by 15%.',
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
