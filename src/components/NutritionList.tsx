'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { NutritionForm } from '@/components/forms/NutritionForm'
import { PlusIcon } from '@heroicons/react/24/outline'
import { Nutrition } from '@/types'
import { formatDateTime } from '@/lib/utils'

interface NutritionListProps {
  nutritionEntries: Nutrition[]
  onNutritionUpdated: () => void
}

export default function NutritionList({ nutritionEntries, onNutritionUpdated }: NutritionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingNutrition, setEditingNutrition] = useState<Nutrition | null>(null)

  const handleEdit = (nutrition: Nutrition) => {
    setEditingId(nutrition.id)
    setEditingNutrition(nutrition)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this nutrition entry?')) {
      return
    }

    try {
      const response = await fetch(`/api/nutrition/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete nutrition entry')
      }

      onNutritionUpdated()
    } catch (error) {
      alert('Failed to delete nutrition entry. Please try again.')
    }
  }

  const handleNutritionUpdated = () => {
    setEditingId(null)
    setEditingNutrition(null)
    onNutritionUpdated()
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingNutrition(null)
  }

  if (nutritionEntries.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <PlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No nutrition logged today
          </h3>
          <p className="text-gray-500 mb-4">
            Start tracking your nutrition by adding your first meal.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {nutritionEntries.map((entry) => {
        const isEditing = editingId === entry.id

        if (isEditing && editingNutrition) {
          return (
            <Card key={entry.id}>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Nutrition Entry
              </h3>
              <NutritionForm
                initialData={editingNutrition}
                editingId={editingId}
                onNutritionAdded={handleNutritionUpdated}
                onCancel={handleCancelEdit}
              />
            </Card>
          )
        }

        return (
          <Card key={entry.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <PlusIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {entry.foodName || 'Nutrition Entry'}
                  </h3>
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>{entry.calories} cal</span>
                    <span>{entry.protein}g protein</span>
                    <span>{entry.carbs}g carbs</span>
                    <span>{entry.fats}g fats</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {formatDateTime(new Date(entry.createdAt))}
                </p>
                <div className="flex space-x-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => handleEdit(entry)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="warning"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
