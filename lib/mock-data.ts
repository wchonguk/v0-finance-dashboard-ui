import type { Transaction, Category, Budget, InsightCard } from './types'

export const categories: Category[] = [
  { id: '1', name: 'Food & Dining', color: '#22c55e' },
  { id: '2', name: 'Transportation', color: '#3b82f6' },
  { id: '3', name: 'Shopping', color: '#f59e0b' },
  { id: '4', name: 'Entertainment', color: '#a855f7' },
  { id: '5', name: 'Bills & Utilities', color: '#ef4444' },
  { id: '6', name: 'Health', color: '#06b6d4' },
  { id: '7', name: 'Travel', color: '#ec4899' },
  { id: '8', name: 'Income', color: '#10b981' },
]

export const transactions: Transaction[] = [
  { id: '1', date: '2024-03-15', description: 'Grocery Store', amount: -85.50, categoryId: '1' },
  { id: '2', date: '2024-03-15', description: 'Monthly Salary', amount: 5200.00, categoryId: '8' },
  { id: '3', date: '2024-03-14', description: 'Uber Ride', amount: -24.30, categoryId: '2' },
  { id: '4', date: '2024-03-14', description: 'Netflix Subscription', amount: -15.99, categoryId: '4' },
  { id: '5', date: '2024-03-13', description: 'Electric Bill', amount: -120.00, categoryId: '5' },
  { id: '6', date: '2024-03-13', description: 'Restaurant Dinner', amount: -65.00, categoryId: '1' },
  { id: '7', date: '2024-03-12', description: 'Online Shopping', amount: -156.80, categoryId: '3' },
  { id: '8', date: '2024-03-12', description: 'Pharmacy', amount: -32.50, categoryId: '6' },
  { id: '9', date: '2024-03-11', description: 'Gas Station', amount: -45.00, categoryId: '2' },
  { id: '10', date: '2024-03-11', description: 'Freelance Payment', amount: 850.00, categoryId: '8' },
  { id: '11', date: '2024-03-10', description: 'Coffee Shop', amount: -12.40, categoryId: '1' },
  { id: '12', date: '2024-03-10', description: 'Movie Tickets', amount: -28.00, categoryId: '4' },
  { id: '13', date: '2024-03-09', description: 'Gym Membership', amount: -49.99, categoryId: '6' },
  { id: '14', date: '2024-03-09', description: 'Clothing Store', amount: -89.00, categoryId: '3' },
  { id: '15', date: '2024-03-08', description: 'Internet Bill', amount: -79.99, categoryId: '5' },
]

export const budgets: Budget[] = [
  { id: '1', categoryId: '1', monthlyLimit: 500, spent: 162.90 },
  { id: '2', categoryId: '2', monthlyLimit: 200, spent: 69.30 },
  { id: '3', categoryId: '3', monthlyLimit: 300, spent: 245.80 },
  { id: '4', categoryId: '4', monthlyLimit: 150, spent: 43.99 },
  { id: '5', categoryId: '5', monthlyLimit: 400, spent: 199.99 },
  { id: '6', categoryId: '6', monthlyLimit: 150, spent: 82.49 },
]

export const insights: InsightCard[] = [
  {
    id: '1',
    title: 'Dining Spending Up',
    description: 'You spent 20% more on dining this month compared to last month.',
    type: 'negative',
    icon: 'utensils',
  },
  {
    id: '2',
    title: 'Subscriptions Increased',
    description: 'Your subscriptions have increased by $30 since January.',
    type: 'negative',
    icon: 'credit-card',
  },
  {
    id: '3',
    title: 'Great Savings!',
    description: 'You saved 15% more than your target this month.',
    type: 'positive',
    icon: 'piggy-bank',
  },
  {
    id: '4',
    title: 'Budget Alert',
    description: 'Shopping budget is at 82% with 10 days remaining.',
    type: 'neutral',
    icon: 'alert-triangle',
  },
]

export const spendingByCategory = [
  { name: 'Food & Dining', value: 162.90, color: '#22c55e' },
  { name: 'Transportation', value: 69.30, color: '#3b82f6' },
  { name: 'Shopping', value: 245.80, color: '#f59e0b' },
  { name: 'Entertainment', value: 43.99, color: '#a855f7' },
  { name: 'Bills & Utilities', value: 199.99, color: '#ef4444' },
  { name: 'Health', value: 82.49, color: '#06b6d4' },
]

export const spendingOverTime = [
  { date: 'Mar 1', amount: 120 },
  { date: 'Mar 3', amount: 85 },
  { date: 'Mar 5', amount: 210 },
  { date: 'Mar 7', amount: 45 },
  { date: 'Mar 9', amount: 167 },
  { date: 'Mar 11', amount: 89 },
  { date: 'Mar 13', amount: 185 },
  { date: 'Mar 15', amount: 110 },
]

export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
