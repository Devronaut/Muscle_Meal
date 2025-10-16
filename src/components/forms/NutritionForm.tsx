'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CreateNutritionData, Nutrition } from '@/types'
import { nutritionValidation } from '@/lib/validations'

// Form data type with string date for HTML input compatibility
type NutritionFormData = Omit<CreateNutritionData, 'date'> & {
  date: string
}

interface NutritionFormProps {
  onNutritionAdded: (nutrition: Nutrition) => void
  onCancel?: () => void
  initialData?: Partial<CreateNutritionData>
  editingId?: string
}

function NutritionForm({ onNutritionAdded, onCancel, initialData, editingId }: NutritionFormProps) {
  const [formData, setFormData] = useState<NutritionFormData>({
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    calories: initialData?.calories || 0,
    protein: initialData?.protein || 0,
    carbs: initialData?.carbs || 0,
    fats: initialData?.fats || 0,
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Validate input
    const validationErrors: { [key: string]: string | null } = {}
    validationErrors.calories = nutritionValidation.calories(formData.calories)
    validationErrors.protein = nutritionValidation.protein(formData.protein)
    validationErrors.carbs = nutritionValidation.carbs(formData.carbs)
    validationErrors.fats = nutritionValidation.fats(formData.fats)

    const hasErrors = Object.values(validationErrors).some(error => error !== null)
    if (hasErrors) {
      setErrors(validationErrors as { [key: string]: string })
      setIsSubmitting(false)
      return
    }

    try {
      const url = editingId ? `/api/nutrition/${editingId}` : '/api/nutrition'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setErrors({ general: data.message || 'Failed to save nutrition entry' })
        }
        return
      }

      onNutritionAdded(data)
      
      // Reset form if not editing
      if (!editingId) {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
        })
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof NutritionFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Food/Meal Name
          </label>
          <input
            type="text"
            className="input"
            placeholder="e.g., Grilled Chicken"
            value={formData.foodName || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, foodName: e.target.value }))}
          />
        </div>

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          error={errors.date}
        />

        <Input
          label="Calories"
          type="number"
          value={formData.calories}
          onChange={(e) => handleInputChange('calories', parseInt(e.target.value) || 0)}
          min="0"
          error={errors.calories}
        />

        <Input
          label="Protein (g)"
          type="number"
          value={formData.protein}
          onChange={(e) => handleInputChange('protein', parseFloat(e.target.value) || 0)}
          min="0"
          step="0.1"
          error={errors.protein}
        />

        <Input
          label="Carbs (g)"
          type="number"
          value={formData.carbs}
          onChange={(e) => handleInputChange('carbs', parseFloat(e.target.value) || 0)}
          min="0"
          step="0.1"
          error={errors.carbs}
        />

        <Input
          label="Fats (g)"
          type="number"
          value={formData.fats}
          onChange={(e) => handleInputChange('fats', parseFloat(e.target.value) || 0)}
          min="0"
          step="0.1"
          error={errors.fats}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="loading-spinner w-4 h-4 mr-2"></div>
              Saving...
            </div>
          ) : editingId ? 'Update Entry' : 'Save Entry'}
        </Button>
      </div>
    </form>
  )
}

export { NutritionForm }