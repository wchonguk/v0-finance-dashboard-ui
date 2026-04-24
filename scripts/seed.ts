import { PrismaNeon } from "@prisma/adapter-neon"
import { neon } from "@neondatabase/serverless"
import { PrismaClient } from "@/lib/generated/prisma"

const sql = neon(process.env.DATABASE_URL!)
const adapter = new PrismaNeon(sql)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // Clear existing data
  await prisma.transaction.deleteMany()
  await prisma.budget.deleteMany()
  await prisma.category.deleteMany()

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Food & Dining", color: "#ef4444" },
    }),
    prisma.category.create({
      data: { name: "Transportation", color: "#3b82f6" },
    }),
    prisma.category.create({
      data: { name: "Shopping", color: "#8b5cf6" },
    }),
    prisma.category.create({
      data: { name: "Entertainment", color: "#f59e0b" },
    }),
    prisma.category.create({
      data: { name: "Bills & Utilities", color: "#6b7280" },
    }),
    prisma.category.create({
      data: { name: "Healthcare", color: "#10b981" },
    }),
    prisma.category.create({
      data: { name: "Income", color: "#22c55e" },
    }),
  ])

  console.log(`Created ${categories.length} categories`)

  const [food, transport, shopping, entertainment, bills, healthcare, income] =
    categories

  // Create budgets
  const budgets = await Promise.all([
    prisma.budget.create({
      data: { categoryId: food.id, amount: 500, period: "monthly" },
    }),
    prisma.budget.create({
      data: { categoryId: transport.id, amount: 300, period: "monthly" },
    }),
    prisma.budget.create({
      data: { categoryId: shopping.id, amount: 400, period: "monthly" },
    }),
    prisma.budget.create({
      data: { categoryId: entertainment.id, amount: 200, period: "monthly" },
    }),
    prisma.budget.create({
      data: { categoryId: bills.id, amount: 800, period: "monthly" },
    }),
    prisma.budget.create({
      data: { categoryId: healthcare.id, amount: 150, period: "monthly" },
    }),
  ])

  console.log(`Created ${budgets.length} budgets`)

  // Create transactions for the past 30 days
  const now = new Date()
  const transactions = []

  // Income transactions
  transactions.push(
    prisma.transaction.create({
      data: {
        description: "Salary",
        amount: 5000,
        type: "income",
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        categoryId: income.id,
      },
    }),
    prisma.transaction.create({
      data: {
        description: "Freelance Project",
        amount: 800,
        type: "income",
        date: new Date(now.getFullYear(), now.getMonth(), 15),
        categoryId: income.id,
      },
    })
  )

  // Expense transactions
  const expenseData = [
    { desc: "Grocery Store", amount: 85.5, cat: food, daysAgo: 1 },
    { desc: "Restaurant Dinner", amount: 65.0, cat: food, daysAgo: 3 },
    { desc: "Coffee Shop", amount: 12.5, cat: food, daysAgo: 5 },
    { desc: "Uber Ride", amount: 24.0, cat: transport, daysAgo: 2 },
    { desc: "Gas Station", amount: 55.0, cat: transport, daysAgo: 7 },
    { desc: "Amazon Purchase", amount: 120.0, cat: shopping, daysAgo: 4 },
    { desc: "Clothing Store", amount: 89.99, cat: shopping, daysAgo: 10 },
    { desc: "Netflix Subscription", amount: 15.99, cat: entertainment, daysAgo: 5 },
    { desc: "Movie Tickets", amount: 32.0, cat: entertainment, daysAgo: 8 },
    { desc: "Electricity Bill", amount: 125.0, cat: bills, daysAgo: 12 },
    { desc: "Internet Bill", amount: 79.99, cat: bills, daysAgo: 12 },
    { desc: "Phone Bill", amount: 65.0, cat: bills, daysAgo: 15 },
    { desc: "Pharmacy", amount: 45.0, cat: healthcare, daysAgo: 6 },
    { desc: "Lunch", amount: 18.5, cat: food, daysAgo: 1 },
    { desc: "Bus Pass", amount: 50.0, cat: transport, daysAgo: 1 },
    { desc: "Electronics Store", amount: 199.99, cat: shopping, daysAgo: 14 },
    { desc: "Spotify Premium", amount: 9.99, cat: entertainment, daysAgo: 20 },
    { desc: "Water Bill", amount: 45.0, cat: bills, daysAgo: 18 },
    { desc: "Doctor Visit", amount: 75.0, cat: healthcare, daysAgo: 22 },
    { desc: "Fast Food", amount: 15.0, cat: food, daysAgo: 2 },
    { desc: "Parking", amount: 12.0, cat: transport, daysAgo: 4 },
    { desc: "Book Store", amount: 35.0, cat: shopping, daysAgo: 9 },
    { desc: "Concert Tickets", amount: 85.0, cat: entertainment, daysAgo: 25 },
    { desc: "Rent", amount: 1500.0, cat: bills, daysAgo: 1 },
  ]

  for (const exp of expenseData) {
    const date = new Date(now)
    date.setDate(date.getDate() - exp.daysAgo)
    transactions.push(
      prisma.transaction.create({
        data: {
          description: exp.desc,
          amount: exp.amount,
          type: "expense",
          date,
          categoryId: exp.cat.id,
        },
      })
    )
  }

  await Promise.all(transactions)

  console.log(`Created ${transactions.length} transactions`)
  console.log("Seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
