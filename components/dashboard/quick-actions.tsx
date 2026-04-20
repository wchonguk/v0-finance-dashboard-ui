import Link from 'next/link'
import { Plus, Upload, PiggyBank } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks at your fingertips</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/transactions?action=add">
            <Plus className="mr-2 size-4" />
            Add Transaction
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/transactions?action=upload">
            <Upload className="mr-2 size-4" />
            Upload CSV
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/budgets?action=add">
            <PiggyBank className="mr-2 size-4" />
            Create Budget
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
