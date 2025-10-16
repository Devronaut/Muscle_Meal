'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PlusIcon, FireIcon } from '@heroicons/react/24/outline'
import { WorkoutForm } from '@/components/forms/WorkoutForm'
import WorkoutList from '@/components/WorkoutList'
import { Workout } from '@/types'

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('/api/workouts')
      if (response.ok) {
        const data = await response.json()
        setWorkouts(data)
      }
    } catch (error) {
      console.error('Error fetching workouts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const handleWorkoutAdded = (newWorkout: Workout) => {
    setWorkouts(prev => [newWorkout, ...prev])
    setShowForm(false)
  }

  const handleWorkoutUpdated = () => {
    fetchWorkouts()
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FireIcon className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-3xl font-bold">Workouts</h1>
                <p className="text-primary-100 mt-1">Track your exercise sessions</p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              {showForm ? 'Hide Form' : 'Add Workout'}
            </Button>
          </div>
        </div>

        {/* Add Workout Form */}
        {showForm && (
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Workout</h3>
            <WorkoutForm 
              onWorkoutAdded={handleWorkoutAdded}
              onCancel={() => setShowForm(false)}
            />
          </Card>
        )}

        {/* Today's Workouts */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Workouts</h2>
          {isLoading ? (
            <Card>
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading workouts...</p>
              </div>
            </Card>
          ) : (
            <WorkoutList 
              workouts={workouts} 
              onWorkoutUpdated={handleWorkoutUpdated}
            />
          )}
        </div>
      </div>
    </Layout>
  )
}
