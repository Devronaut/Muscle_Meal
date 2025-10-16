'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PlusIcon } from '@heroicons/react/24/outline'
import { NutritionForm } from '@/components/forms/NutritionForm'
import NutritionList from '@/components/NutritionList'
import { Nutrition } from '@/types'

export default function NutritionPage() {
  const [nutritionEntries, setNutritionEntries] = useState<Nutrition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  })

  const fetchNutrition = async () => {
    try {
      const response = await fetch('/api/nutrition')
      if (response.ok) {
        const data = await response.json()
        setNutritionEntries(data)
        
        // Calculate totals
        const newTotals = data.reduce((totals: any, entry: Nutrition) => ({
          calories: totals.calories + entry.calories,
          protein: totals.protein + entry.protein,
          carbs: totals.carbs + entry.carbs,
          fats: totals.fats + entry.fats,
        }), { calories: 0, protein: 0, carbs: 0, fats: 0 })
        
        setTotals(newTotals)
      }
    } catch (error) {
      console.error('Error fetching nutrition:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNutrition()
  }, [])

  const handleNutritionAdded = (newNutrition: Nutrition) => {
    setNutritionEntries(prev => [newNutrition, ...prev])
    
    // Update totals
    setTotals(prev => ({
      calories: prev.calories + newNutrition.calories,
      protein: prev.protein + newNutrition.protein,
      carbs: prev.carbs + newNutrition.carbs,
      fats: prev.fats + newNutrition.fats,
    }))
    
    setShowForm(false)
  }

  const handleNutritionUpdated = () => {
    fetchNutrition()
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <PlusIcon className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-3xl font-bold">Nutrition</h1>
                <p className="text-primary-100 mt-1">Track your daily food intake</p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              {showForm ? 'Hide Form' : 'Add Food'}
            </Button>
          </div>
        </div>

        {/* Add Food Form */}
        {showForm && (
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Food Entry</h3>
            <NutritionForm 
              onNutritionAdded={handleNutritionAdded}
              onCancel={() => setShowForm(false)}
            />
          </Card>
        )}

        {/* Today's Totals */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Totals</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{totals.calories}</div>
                <div className="text-sm text-gray-500">Calories</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">{totals.protein}g</div>
                <div className="text-sm text-gray-500">Protein</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning-600">{totals.carbs}g</div>
                <div className="text-sm text-gray-500">Carbs</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{totals.fats}g</div>
                <div className="text-sm text-gray-500">Fats</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Today's Food Log */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Food Log</h2>
          {isLoading ? (
            <Card>
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading nutrition data...</p>
              </div>
            </Card>
          ) : (
            <NutritionList 
              nutritionEntries={nutritionEntries} 
              onNutritionUpdated={handleNutritionUpdated}
            />
          )}
        </div>
      </div>
    </Layout>
  )
}
