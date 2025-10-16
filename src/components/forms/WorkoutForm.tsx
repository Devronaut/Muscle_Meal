'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CreateWorkoutData, Workout, WorkoutSet } from '@/types'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { workoutValidation } from '@/lib/validations'

interface WorkoutFormProps {
  onWorkoutAdded: (workout: Workout) => void
  onCancel?: () => void
  initialData?: Partial<CreateWorkoutData>
  editingId?: string
}

function WorkoutForm({ onWorkoutAdded, onCancel, initialData, editingId }: WorkoutFormProps) {
  const [formData, setFormData] = useState<CreateWorkoutData>({
    exerciseName: initialData?.exerciseName || '',
    date: initialData?.date?.toString().split('T')[0] || new Date().toISOString().split('T')[0],
    sets: initialData?.sets || [{ reps: 8, weight: 0 }],
    notes: initialData?.notes || '',
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Validate input
    const validationErrors: { [key: string]: string | null } = {}
    validationErrors.exerciseName = workoutValidation.exerciseName(formData.exerciseName)
    validationErrors.sets = workoutValidation.sets(formData.sets)

    const hasErrors = Object.values(validationErrors).some(error => error !== null)
    if (hasErrors) {
      setErrors(validationErrors as { [key: string]: string })
      setIsSubmitting(false)
      return
    }

    try {
      const url = editingId ? `/api/workouts/${editingId}` : '/api/workouts'
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
          setErrors({ general: data.message || 'Failed to save workout' })
        }
        return
      }

      onWorkoutAdded(data)
      
      // Reset form if not editing
      if (!editingId) {
        setFormData({
          exerciseName: '',
          date: new Date().toISOString().split('T')[0],
          sets: [{ reps: 8, weight: 0 }],
          notes: '',
        })
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof CreateWorkoutData, value: string | number | WorkoutSet[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addSet = () => {
    const newSets = [...formData.sets, { reps: 8, weight: 0 }]
    handleInputChange('sets', newSets)
  }

  const removeSet = (index: number) => {
    if (formData.sets.length > 1) {
      const newSets = formData.sets.filter((_, i) => i !== index)
      handleInputChange('sets', newSets)
    }
  }

  const updateSet = (index: number, field: 'reps' | 'weight', value: number) => {
    const newSets = formData.sets.map((set, i) => 
      i === index ? { ...set, [field]: value } : set
    )
    handleInputChange('sets', newSets)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Exercise Name"
          value={formData.exerciseName}
          onChange={(e) => handleInputChange('exerciseName', e.target.value)}
          placeholder="e.g., Bench Press"
          error={errors.exerciseName}
        />

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          error={errors.date}
        />
      </div>

      {/* Sets Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Sets
          </label>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addSet}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Set
          </Button>
        </div>

        <div className="space-y-3">
          {formData.sets.map((set, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
              <div className="text-sm font-semibold text-gray-700 w-12 flex-shrink-0">
                Set {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-500 mb-1">Reps</label>
                <input
                  type="number"
                  className="input text-center"
                  value={set.reps}
                  onChange={(e) => updateSet(index, 'reps', parseInt(e.target.value) || 0)}
                  min="1"
                  placeholder="8"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-500 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  className="input text-center"
                  value={set.weight}
                  onChange={(e) => updateSet(index, 'weight', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.5"
                  placeholder="0"
                />
              </div>
              
              {formData.sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSet(index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 flex-shrink-0"
                  title="Remove set"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        {errors.sets && (
          <p className="text-sm text-red-600 mt-2">{errors.sets}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          className="input"
          rows={3}
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="How did it feel? Any observations..."
        />
        {errors.notes && (
          <p className="text-sm text-red-600 mt-1">{errors.notes}</p>
        )}
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
          ) : editingId ? 'Update Workout' : 'Save Workout'}
        </Button>
      </div>
    </form>
  )
}

export { WorkoutForm }