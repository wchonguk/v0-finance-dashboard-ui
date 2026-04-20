export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  categoryId: string
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface Budget {
  id: string
  categoryId: string
  monthlyLimit: number
  spent: number
}

export interface InsightCard {
  id: string
  title: string
  description: string
  type: 'positive' | 'negative' | 'neutral'
  icon: string
}
