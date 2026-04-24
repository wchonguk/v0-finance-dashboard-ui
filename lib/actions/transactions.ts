"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getTransactions(options?: {
  search?: string
  categoryId?: string
  sortBy?: "date" | "amount"
  sortOrder?: "asc" | "desc"
  limit?: number
}) {
  const { search, categoryId, sortBy = "date", sortOrder = "desc", limit } = options || {}

  return prisma.transaction.findMany({
    where: {
      AND: [
        search
          ? {
              description: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {},
        categoryId ? { categoryId } : {},
      ],
    },
    include: {
      category: true,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    take: limit,
  })
}

export async function getTransactionById(id: string) {
  return prisma.transaction.findUnique({
    where: { id },
    include: { category: true },
  })
}

export async function createTransaction(data: {
  description: string
  amount: number
  type: "income" | "expense"
  date: Date
  categoryId: string
}) {
  const transaction = await prisma.transaction.create({
    data,
  })
  revalidatePath("/", "page")
  revalidatePath("/transactions", "page")
  revalidatePath("/budgets", "page")
  revalidatePath("/insights", "page")
  return transaction
}

export async function updateTransaction(
  id: string,
  data: {
    description?: string
    amount?: number
    type?: "income" | "expense"
    date?: Date
    categoryId?: string
  }
) {
  const transaction = await prisma.transaction.update({
    where: { id },
    data,
  })
  revalidatePath("/", "page")
  revalidatePath("/transactions", "page")
  revalidatePath("/budgets", "page")
  revalidatePath("/insights", "page")
  return transaction
}

export async function deleteTransaction(id: string) {
  await prisma.transaction.delete({
    where: { id },
  })
  revalidatePath("/", "page")
  revalidatePath("/transactions", "page")
  revalidatePath("/budgets", "page")
  revalidatePath("/insights", "page")
}

export async function getTransactionStats() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  })

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  return {
    totalIncome,
    totalExpenses,
    balance,
    transactionCount: transactions.length,
  }
}

export async function getSpendingByCategory() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const spending = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      type: "expense",
      date: {
        gte: startOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  })

  const categories = await prisma.category.findMany()

  return spending.map((s) => {
    const category = categories.find((c) => c.id === s.categoryId)
    return {
      categoryId: s.categoryId,
      categoryName: category?.name || "Unknown",
      categoryColor: category?.color || "#888888",
      amount: s._sum.amount || 0,
    }
  })
}

export async function getSpendingOverTime(days: number = 30) {
  const now = new Date()
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: startDate,
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  // Group by date
  const dailyData: Record<string, { income: number; expenses: number }> = {}

  transactions.forEach((t) => {
    const dateKey = t.date.toISOString().split("T")[0]
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = { income: 0, expenses: 0 }
    }
    if (t.type === "income") {
      dailyData[dateKey].income += t.amount
    } else {
      dailyData[dateKey].expenses += t.amount
    }
  })

  return Object.entries(dailyData).map(([date, data]) => ({
    date,
    income: data.income,
    expenses: data.expenses,
  }))
}
