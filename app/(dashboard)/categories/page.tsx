'use client'

import { useState } from 'react'
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
import { categories as mockCategories, transactions } from '@/lib/mock-data'
import type { Category } from '@/lib/types'

export default function CategoriesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)

  // Count transactions per category
  const categoryTransactionCounts = mockCategories.reduce(
    (acc, cat) => {
      acc[cat.id] = transactions.filter((t) => t.categoryId === cat.id).length
      return acc
    },
    {} as Record<string, number>
  )

  const handleAddCategory = (data: Omit<Category, 'id'>) => {
    // In a real app, this would call an API
    console.log('Add category:', data)
    setIsAddDialogOpen(false)
  }

  const handleEditCategory = (data: Omit<Category, 'id'>) => {
    // In a real app, this would call an API
    console.log('Update category:', { id: editCategory?.id, ...data })
    setEditCategory(null)
  }

  const handleDeleteCategory = () => {
    // In a real app, this would call an API
    console.log('Delete category:', deleteCategory?.id)
    setDeleteCategory(null)
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
            <Button>
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
      {mockCategories.length === 0 ? (
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
          {mockCategories.map((category) => (
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
                    {categoryTransactionCounts[category.id] || 0} transactions
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
                      onClick={() => setDeleteCategory(category)}
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
        open={!!deleteCategory}
        onOpenChange={() => setDeleteCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteCategory?.name}&quot;? This
              action cannot be undone.
              {categoryTransactionCounts[deleteCategory?.id || ''] > 0 && (
                <span className="block mt-2 text-destructive">
                  Warning: This category has{' '}
                  {categoryTransactionCounts[deleteCategory?.id || '']}{' '}
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
