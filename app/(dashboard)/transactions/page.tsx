import { TransactionsClient } from './transactions-client'
import { getTransactions } from '@/lib/actions/transactions'
import { getCategories } from '@/lib/actions/categories'

export default async function TransactionsPage() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories(),
  ])

  return (
    <TransactionsClient 
      initialTransactions={transactions} 
      categories={categories} 
    />
  )
}
