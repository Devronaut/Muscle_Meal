'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  CalendarDaysIcon, 
  ChevronDownIcon, 
  ChevronRightIcon,
  FireIcon,
  PlusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { format, startOfWeek, endOfWeek, isSameWeek, subWeeks } from 'date-fns'
import { Workout, Nutrition } from '@/types'

interface DailyLog {
  date: string
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fats: number
    entries: Array<{
      id: string
      foodName?: string
      calories: number
      protein: number
      carbs: number
      fats: number
    }>
  }
  workouts: {
    totalVolume: number
    exercises: Array<{
      id: string
      exerciseName: string
      sets: Array<{ reps: number; weight: number }>
      notes?: string
    }>
  }
}

interface WeeklyData {
  weekStart: string
  weekEnd: string
  weekLabel: string
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFats: number
  totalWorkoutVolume: number
  totalWorkouts: number
  days: DailyLog[]
}

export default function HistoryPage() {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchHistoryData = async () => {
    try {
      setIsLoading(true)
      
      // Get data for the last 12 weeks
      const weeks = []
      for (let i = 0; i < 12; i++) {
        const weekStart = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 })
        // Calculate week end as 6 days after week start (7 days total, non-overlapping)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        
        weeks.push({
          start: weekStart.toISOString().split('T')[0],
          end: weekEnd.toISOString().split('T')[0]
        })
      }

      const allWeeklyData: WeeklyData[] = []

      for (const week of weeks) {
        const dailyLogs: DailyLog[] = []
        let totalCalories = 0
        let totalProtein = 0
        let totalCarbs = 0
        let totalFats = 0
        let totalWorkoutVolume = 0
        let totalWorkouts = 0

        // Fetch nutrition data for the week
        const nutritionResponse = await fetch(`/api/nutrition?startDate=${week.start}&endDate=${week.end}`)
        const nutritionData = nutritionResponse.ok ? await nutritionResponse.json() : []

        // Fetch workout data for the week
        const workoutResponse = await fetch(`/api/workouts?startDate=${week.start}&endDate=${week.end}`)
        const workoutData = workoutResponse.ok ? await workoutResponse.json() : []

        // Group data by day
        const daysInWeek = []
        for (let i = 0; i < 7; i++) {
          const date = new Date(week.start)
          date.setDate(date.getDate() + i)
          daysInWeek.push(date.toISOString().split('T')[0])
        }

        daysInWeek.forEach(date => {
          const dayNutrition = nutritionData.filter((n: Nutrition) => n.date.startsWith(date))
          const dayWorkouts = workoutData.filter((w: Workout) => w.date.startsWith(date))

          const dayCalories = dayNutrition.reduce((sum: number, n: Nutrition) => sum + n.calories, 0)
          const dayProtein = dayNutrition.reduce((sum: number, n: Nutrition) => sum + n.protein, 0)
          const dayCarbs = dayNutrition.reduce((sum: number, n: Nutrition) => sum + n.carbs, 0)
          const dayFats = dayNutrition.reduce((sum: number, n: Nutrition) => sum + n.fats, 0)
          
          const dayWorkoutVolume = dayWorkouts.reduce((sum: number, w: Workout) => {
            // Handle both cases: sets as string (from DB) or as array (from API)
            const sets = typeof w.sets === 'string' ? JSON.parse(w.sets) : w.sets
            return sum + sets.reduce((setSum: number, set: {reps: number, weight: number}) => setSum + (set.reps * set.weight), 0)
          }, 0)

          totalCalories += dayCalories
          totalProtein += dayProtein
          totalCarbs += dayCarbs
          totalFats += dayFats
          totalWorkoutVolume += dayWorkoutVolume
          totalWorkouts += dayWorkouts.length

          dailyLogs.push({
            date,
            nutrition: {
              calories: dayCalories,
              protein: dayProtein,
              carbs: dayCarbs,
              fats: dayFats,
              entries: dayNutrition
            },
            workouts: {
              totalVolume: dayWorkoutVolume,
              exercises: dayWorkouts
            }
          })
        })

        // Only include weeks that have data
        if (totalCalories > 0 || totalWorkouts > 0) {
          allWeeklyData.push({
            weekStart: week.start,
            weekEnd: week.end,
            weekLabel: `${format(new Date(week.start), 'MMM dd')} - ${format(new Date(week.end), 'MMM dd, yyyy')}`,
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFats,
            totalWorkoutVolume,
            totalWorkouts,
            days: dailyLogs
          })
        }
      }

      setWeeklyData(allWeeklyData)
    } catch (error) {
      console.error('Error fetching history data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistoryData()
  }, [])

  const toggleWeekExpansion = (weekStart: string) => {
    setExpandedWeek(expandedWeek === weekStart ? null : weekStart)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <CalendarDaysIcon className="h-8 w-8 mr-3" />
            <div>
              <h1 className="text-3xl font-bold">History</h1>
              <p className="text-primary-100 mt-1">Review your weekly progress and daily logs</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : weeklyData.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No History Yet</h3>
              <p className="text-gray-500">Start logging workouts and nutrition to see your history here.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {weeklyData.map((week) => (
              <Card key={week.weekStart} className="overflow-hidden">
                <div 
                  className="cursor-pointer p-6 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleWeekExpansion(week.weekStart)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {expandedWeek === week.weekStart ? (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500 mr-3" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5 text-gray-500 mr-3" />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{week.weekLabel}</h3>
                        <p className="text-sm text-gray-500">
                          {week.totalWorkouts} workouts • {week.totalCalories.toLocaleString()} calories
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-primary-600">{week.totalCalories.toLocaleString()}</div>
                        <div className="text-gray-500">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-success-600">{week.totalProtein}g</div>
                        <div className="text-gray-500">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-warning-600">{week.totalCarbs}g</div>
                        <div className="text-gray-500">Carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-orange-600">{week.totalFats}g</div>
                        <div className="text-gray-500">Fats</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-red-600">{week.totalWorkoutVolume.toLocaleString()}</div>
                        <div className="text-gray-500">Volume (kg)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedWeek === week.weekStart && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <div className="space-y-4">
                      {week.days.map((day) => (
                        <div key={day.date} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">
                              {format(new Date(day.date), 'EEEE, MMM dd')}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{day.nutrition.calories} cal</span>
                              <span>{day.nutrition.protein}g protein</span>
                              <span>{day.workouts.totalVolume.toLocaleString()}kg volume</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Nutrition */}
                            <div>
                              <div className="flex items-center mb-2">
                                <PlusIcon className="h-4 w-4 text-green-600 mr-2" />
                                <span className="text-sm font-medium text-gray-700">Nutrition</span>
                              </div>
                              {day.nutrition.entries.length > 0 ? (
                                <div className="space-y-1">
                                  {day.nutrition.entries.map((entry) => (
                                    <div key={entry.id} className="text-xs text-gray-600 bg-green-50 p-2 rounded">
                                      <span className="font-medium">{entry.foodName || 'Meal'}</span>
                                      <span className="ml-2">{entry.calories} cal, {entry.protein}g protein</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400 italic">No nutrition logged</p>
                              )}
                            </div>

                            {/* Workouts */}
                            <div>
                              <div className="flex items-center mb-2">
                                <FireIcon className="h-4 w-4 text-red-600 mr-2" />
                                <span className="text-sm font-medium text-gray-700">Workouts</span>
                              </div>
                              {day.workouts.exercises.length > 0 ? (
                                <div className="space-y-1">
                                  {day.workouts.exercises.map((workout) => (
                                    <div key={workout.id} className="text-xs text-gray-600 bg-red-50 p-2 rounded">
                                      <span className="font-medium">{workout.exerciseName}</span>
                                      <span className="ml-2">{workout.sets.length} sets</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400 italic">No workouts logged</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
