'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Category } from '@/lib/types'

const colorOptions = [
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#a855f7', // Purple
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f97316', // Orange
  '#8b5cf6', // Violet
]

interface CategoryFormProps {
  category?: Category
  onSubmit: (data: Omit<Category, 'id'>) => void
  onCancel: () => void
}

export function CategoryForm({
  category,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? '')
  const [color, setColor] = useState(category?.color ?? colorOptions[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, color })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`size-8 rounded-full transition-all ${
                color === c
                  ? 'ring-2 ring-offset-2 ring-primary'
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
        <div
          className="size-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <div
            className="size-4 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        <div>
          <p className="font-medium">{name || 'Category Preview'}</p>
          <p className="text-xs text-muted-foreground">
            This is how your category will look
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {category ? 'Update' : 'Create'} Category
        </Button>
      </div>
    </form>
  )
}
