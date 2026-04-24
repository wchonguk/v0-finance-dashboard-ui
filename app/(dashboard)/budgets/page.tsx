import { BudgetsClient } from './budgets-client'
import { getBudgets } from '@/lib/actions/budgets'
import { getCategories } from '@/lib/actions/categories'

export default async function BudgetsPage() {
  const [budgets, categories] = await Promise.all([
    getBudgets(),
    getCategories(),
  ])

  return (
    <BudgetsClient 
      initialBudgets={budgets} 
      categories={categories} 
    />
  )
}
