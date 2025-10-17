'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  FlagIcon, 
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import { Goal, GoalProgress, CreateGoalData } from '@/types'

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [goalProgress, setGoalProgress] = useState<GoalProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  const [formData, setFormData] = useState<CreateGoalData>({
    name: 'Daily Nutrition Goals',
    type: 'daily',
    category: 'nutrition',
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 65,
    isActive: true,
    startDate: new Date(),
  })

  const fetchGoals = async () => {
    try {
      setIsLoading(true)
      const [goalsResponse, progressResponse] = await Promise.all([
        fetch('/api/goals'),
        fetch('/api/goals/progress')
      ])
      
      if (goalsResponse.ok) {
        const goalsData = await goalsResponse.json()
        setGoals(goalsData)
      }
      
      if (progressResponse.ok) {
        const progressData = await progressResponse.json()
        setGoalProgress(progressData)
      }
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingGoal ? `/api/goals/${editingGoal.id}` : '/api/goals'
      const method = editingGoal ? 'PUT' : 'POST'
      
      // Ensure startDate is properly serialized
      const dataToSend = {
        ...formData,
        startDate: formData.startDate instanceof Date ? formData.startDate.toISOString() : formData.startDate
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        await fetchGoals()
        setShowCreateForm(false)
        setEditingGoal(null)
        resetForm()
      } else {
        const error = await response.json()
        console.error('Error saving goal:', error)
      }
    } catch (error) {
      console.error('Error saving goal:', error)
    }
  }

  const handleDelete = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return
    
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchGoals()
      } else {
        console.error('Error deleting goal')
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: 'Daily Nutrition Goals',
      type: 'daily',
      category: 'nutrition',
      calories: 2000,
      protein: 150,
      carbs: 250,
      fats: 65,
      isActive: true,
      startDate: new Date(),
    })
  }

  const startEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setFormData({
      name: goal.name,
      type: goal.type,
      category: goal.category,
      calories: goal.calories || undefined,
      protein: goal.protein || undefined,
      carbs: goal.carbs || undefined,
      fats: goal.fats || undefined,
      workouts: goal.workouts || undefined,
      volume: goal.volume || undefined,
      isActive: goal.isActive,
      startDate: goal.startDate,
    })
    setShowCreateForm(true)
  }

  const cancelEdit = () => {
    setShowCreateForm(false)
    setEditingGoal(null)
    resetForm()
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'text-green-600'
    if (progress >= 75) return 'text-blue-600'
    if (progress >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressBarColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 75) return 'bg-blue-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FlagIcon className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-3xl font-bold">Goals</h1>
                <p className="text-primary-100 mt-1">Set and track your daily nutrition targets</p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Set Goals
            </Button>
          </div>
        </div>

        {/* Create Goal Form */}
        {showCreateForm && !editingGoal && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create New Goal</h3>
              <button
                onClick={cancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Daily Nutrition Goals"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="input"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      category: e.target.value 
                    }))}
                  >
                    <option value="nutrition">Nutrition</option>
                    <option value="workout">Workout</option>
                  </select>
                </div>
              </div>

              {formData.category === 'nutrition' && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calories
                    </label>
                    <input
                      type="number"
                      className="input"
                      value={formData.calories || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        calories: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      placeholder="2000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input"
                      value={formData.protein || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        protein: e.target.value ? parseFloat(e.target.value) : undefined 
                      }))}
                      placeholder="150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input"
                      value={formData.carbs || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        carbs: e.target.value ? parseFloat(e.target.value) : undefined 
                      }))}
                      placeholder="250"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fats (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input"
                      value={formData.fats || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        fats: e.target.value ? parseFloat(e.target.value) : undefined 
                      }))}
                      placeholder="65"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
                <Button type="submit">Create Goal</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Goals List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : goals.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <FlagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Goals Set</h3>
              <p className="text-gray-500">Create your first goal to start tracking your progress.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = goalProgress.find(p => p.goal.id === goal.id)
              
              return (
                <Card key={goal.id}>
                  {editingGoal && editingGoal.id === goal.id ? (
                    // Edit form inline
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Edit Goal</h3>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Goal Name
                            </label>
                            <input
                              type="text"
                              className="input"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g., Daily Nutrition Goals"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Category
                            </label>
                            <select
                              className="input"
                              value={formData.category}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                category: e.target.value 
                              }))}
                            >
                              <option value="nutrition">Nutrition</option>
                              <option value="workout">Workout</option>
                            </select>
                          </div>
                        </div>

                        {formData.category === 'nutrition' && (
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Calories
                              </label>
                              <input
                                type="number"
                                className="input"
                                value={formData.calories || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  calories: e.target.value ? parseInt(e.target.value) : undefined 
                                }))}
                                placeholder="2000"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Protein (g)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                className="input"
                                value={formData.protein || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  protein: e.target.value ? parseFloat(e.target.value) : undefined 
                                }))}
                                placeholder="150"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Carbs (g)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                className="input"
                                value={formData.carbs || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  carbs: e.target.value ? parseFloat(e.target.value) : undefined 
                                }))}
                                placeholder="250"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fats (g)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                className="input"
                                value={formData.fats || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  fats: e.target.value ? parseFloat(e.target.value) : undefined 
                                }))}
                                placeholder="65"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end space-x-3">
                          <Button type="button" variant="outline" onClick={cancelEdit}>
                            Cancel
                          </Button>
                          <Button type="submit">Update Goal</Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    // Normal goal display
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">
                            {goal.type} {goal.category} goals
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEdit(goal)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Edit goal"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(goal.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete goal"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {goal.category === 'nutrition' && progress && (
                        <div className="space-y-3">
                          {goal.calories && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Calories</span>
                                <span className={getProgressColor(progress.progress.calories)}>
                                  {progress.current.calories} / {goal.calories} ({progress.progress.calories}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getProgressBarColor(progress.progress.calories)}`}
                                  style={{ width: `${Math.min(progress.progress.calories, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {goal.protein && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Protein</span>
                                <span className={getProgressColor(progress.progress.protein)}>
                                  {progress.current.protein.toFixed(1)}g / {goal.protein}g ({progress.progress.protein}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getProgressBarColor(progress.progress.protein)}`}
                                  style={{ width: `${Math.min(progress.progress.protein, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {goal.carbs && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Carbs</span>
                                <span className={getProgressColor(progress.progress.carbs)}>
                                  {progress.current.carbs.toFixed(1)}g / {goal.carbs}g ({progress.progress.carbs}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getProgressBarColor(progress.progress.carbs)}`}
                                  style={{ width: `${Math.min(progress.progress.carbs, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {goal.fats && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Fats</span>
                                <span className={getProgressColor(progress.progress.fats)}>
                                  {progress.current.fats.toFixed(1)}g / {goal.fats}g ({progress.progress.fats}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getProgressBarColor(progress.progress.fats)}`}
                                  style={{ width: `${Math.min(progress.progress.fats, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}