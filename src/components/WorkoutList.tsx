'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { WorkoutForm } from '@/components/forms/WorkoutForm'
import { FireIcon } from '@heroicons/react/24/outline'
import { Workout } from '@/types'
import { calculateWorkoutVolume, formatDateTime } from '@/lib/utils'

interface WorkoutListProps {
  workouts: Workout[]
  onWorkoutUpdated: () => void
}

export default function WorkoutList({ workouts, onWorkoutUpdated }: WorkoutListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null)

  const handleEdit = (workout: Workout) => {
    setEditingId(workout.id)
    setEditingWorkout(workout)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workout?')) {
      return
    }

    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete workout')
      }

      onWorkoutUpdated()
    } catch (error) {
      alert('Failed to delete workout. Please try again.')
    }
  }

  const handleWorkoutUpdated = () => {
    setEditingId(null)
    setEditingWorkout(null)
    onWorkoutUpdated()
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingWorkout(null)
  }

  if (workouts.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <FireIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No workouts logged today
          </h3>
          <p className="text-gray-500 mb-4">
            Start tracking your fitness journey by adding your first workout.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => {
        const volume = calculateWorkoutVolume(workout.sets)
        const isEditing = editingId === workout.id

        if (isEditing && editingWorkout) {
          return (
            <Card key={workout.id}>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Workout
              </h3>
              <WorkoutForm
                initialData={editingWorkout}
                editingId={editingId}
                onWorkoutAdded={handleWorkoutUpdated}
                onCancel={handleCancelEdit}
              />
            </Card>
          )
        }

        return (
          <Card key={workout.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FireIcon className="h-8 w-8 text-red-600 mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {workout.exerciseName}
                  </h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    {workout.sets.map((set, index) => (
                      <p key={index}>
                        Set {index + 1}: {set.reps} reps × {set.weight}kg
                      </p>
                    ))}
                    <p className="font-medium">
                      Total Volume: {volume.toLocaleString()}kg
                    </p>
                  </div>
                  {workout.notes && (
                    <p className="text-sm text-gray-600 mt-1 italic">
                      "{workout.notes}"
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {formatDateTime(new Date(workout.createdAt))}
                </p>
                <div className="flex space-x-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => handleEdit(workout)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="warning"
                    onClick={() => handleDelete(workout.id)}
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
