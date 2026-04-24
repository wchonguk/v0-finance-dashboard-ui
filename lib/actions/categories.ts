"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  })
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
  })
}

export async function createCategory(data: {
  name: string
  color: string
  icon?: string
}) {
  const category = await prisma.category.create({
    data,
  })
  revalidatePath("/categories", "page")
  revalidatePath("/transactions", "page")
  return category
}

export async function updateCategory(
  id: string,
  data: { name?: string; color?: string; icon?: string }
) {
  const category = await prisma.category.update({
    where: { id },
    data,
  })
  revalidatePath("/categories", "page")
  revalidatePath("/transactions", "page")
  return category
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({
    where: { id },
  })
  revalidatePath("/categories", "page")
  revalidatePath("/transactions", "page")
}
