"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getBudgets() {
  const budgets = await prisma.budget.findMany({
    include: {
      category: true,
    },
    orderBy: { category: { name: "asc" } },
  })

  // Calculate spent amount for each budget
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const budgetsWithSpent = await Promise.all(
    budgets.map(async (budget) => {
      const spent = await prisma.transaction.aggregate({
        where: {
          categoryId: budget.categoryId,
          type: "expense",
          date: {
            gte: startOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      })

      return {
        ...budget,
        spent: spent._sum.amount || 0,
      }
    })
  )

  return budgetsWithSpent
}

export async function getBudgetById(id: string) {
  return prisma.budget.findUnique({
    where: { id },
    include: { category: true },
  })
}

export async function createBudget(data: {
  categoryId: string
  amount: number
  period: "monthly" | "weekly" | "yearly"
}) {
  const budget = await prisma.budget.create({
    data,
  })
  revalidatePath("/budgets", "page")
  revalidatePath("/", "page")
  return budget
}

export async function updateBudget(
  id: string,
  data: {
    categoryId?: string
    amount?: number
    period?: "monthly" | "weekly" | "yearly"
  }
) {
  const budget = await prisma.budget.update({
    where: { id },
    data,
  })
  revalidatePath("/budgets", "page")
  revalidatePath("/", "page")
  return budget
}

export async function deleteBudget(id: string) {
  await prisma.budget.delete({
    where: { id },
  })
  revalidatePath("/budgets", "page")
  revalidatePath("/", "page")
}

export async function getBudgetStats() {
  const budgets = await getBudgets()

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const remaining = totalBudget - totalSpent

  return {
    totalBudget,
    totalSpent,
    remaining,
    budgetCount: budgets.length,
  }
}
