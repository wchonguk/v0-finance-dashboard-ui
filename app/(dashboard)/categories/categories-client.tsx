'use client'

import { useState, useTransition } from 'react'
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CategoryForm } from '@/components/categories/category-form'
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/categories'

interface Category {
  id: string
  name: string
  color: string
  _count?: { transactions: number }
}

interface CategoriesClientProps {
  initialCategories: Category[]
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [deleteCategoryState, setDeleteCategoryState] = useState<Category | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleAddCategory = async (data: { name: string; color: string }) => {
    startTransition(async () => {
      await createCategory(data)
      setIsAddDialogOpen(false)
    })
  }

  const handleEditCategory = async (data: { name: string; color: string }) => {
    if (editCategory) {
      startTransition(async () => {
        await updateCategory(editCategory.id, data)
        setEditCategory(null)
      })
    }
  }

  const handleDeleteCategory = async () => {
    if (deleteCategoryState) {
      startTransition(async () => {
        await deleteCategory(deleteCategoryState.id)
        setDeleteCategoryState(null)
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Organize your transactions with custom categories.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={isPending}>
              <Plus className="mr-2 size-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>
                Create a new category for your transactions.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm
              onSubmit={handleAddCategory}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      {initialCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-2xl">🏷️</span>
          </div>
          <h3 className="text-lg font-medium">No categories yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first category to organize your transactions.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {initialCategories.map((category) => (
            <Card key={category.id} className="group relative">
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className="size-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <div
                    className="size-5 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category._count?.transactions || 0} transactions
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditCategory(category)}>
                      <Pencil className="mr-2 size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteCategoryState(category)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Category Dialog */}
      <Dialog open={!!editCategory} onOpenChange={() => setEditCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update your category details.
            </DialogDescription>
          </DialogHeader>
          {editCategory && (
            <CategoryForm
              category={editCategory}
              onSubmit={handleEditCategory}
              onCancel={() => setEditCategory(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteCategoryState}
        onOpenChange={() => setDeleteCategoryState(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteCategoryState?.name}&quot;? This
              action cannot be undone.
              {(deleteCategoryState?._count?.transactions || 0) > 0 && (
                <span className="block mt-2 text-destructive">
                  Warning: This category has{' '}
                  {deleteCategoryState?._count?.transactions || 0}{' '}
                  transactions associated with it.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
