'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { spendingOverTime } from '@/lib/mock-data'

export function SpendingChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Over Time</CardTitle>
        <CardDescription>Your daily spending this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spendingOverTime}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.45 0.15 160)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.45 0.15 160)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'currentColor', fontSize: 12 }}
                tickLine={{ stroke: 'currentColor' }}
                axisLine={{ stroke: 'currentColor' }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fill: 'currentColor', fontSize: 12 }}
                tickLine={{ stroke: 'currentColor' }}
                axisLine={{ stroke: 'currentColor' }}
                tickFormatter={(value) => `£${value}`}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-foreground)',
                }}
                formatter={(value: number) => [`£${value.toFixed(2)}`, 'Spent']}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="oklch(0.45 0.15 160)"
                strokeWidth={2}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
