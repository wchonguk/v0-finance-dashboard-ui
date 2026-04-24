import { CategoriesClient } from './categories-client'
import { getCategories } from '@/lib/actions/categories'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return <CategoriesClient initialCategories={categories} />
}
