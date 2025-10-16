'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { ChartBarIcon } from '@heroicons/react/24/outline'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns'
import { Workout } from '@/types'

interface WeeklyData {
  day: string
  calories: number
  protein: number
  carbs: number
  fats: number
  volume: number
}

interface MonthlyStats {
  avgCalories: number
  avgProtein: number
  avgCarbs: number
  avgFats: number
  totalWorkouts: number
  totalVolume: number
  avgVolumePerWorkout: number
}

export default function ProgressPage() {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    avgCalories: 0,
    avgProtein: 0,
    avgCarbs: 0,
    avgFats: 0,
    totalWorkouts: 0,
    totalVolume: 0,
    avgVolumePerWorkout: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchProgressData = async () => {
    try {
      // Get data for the past 7 days
      const endDate = new Date()
      const startDate = subDays(endDate, 6)
      
      const promises = []
      const dates = []
      
      // Generate array of last 7 days
      for (let i = 0; i < 7; i++) {
        const date = subDays(endDate, i)
        dates.unshift(date) // Add to beginning to get chronological order
        promises.push(
          fetch(`/api/stats?date=${format(date, 'yyyy-MM-dd')}`),
          fetch(`/api/workouts?date=${format(date, 'yyyy-MM-dd')}`),
          fetch(`/api/nutrition?date=${format(date, 'yyyy-MM-dd')}`)
        )
      }

      const responses = await Promise.all(promises)
      
      // Process the data
      const weeklyStats = []
      for (let i = 0; i < 7; i++) {
        const statsResponse = responses[i * 3]
        const workoutsResponse = responses[i * 3 + 1]
        const nutritionResponse = responses[i * 3 + 2]
        
        const stats = await statsResponse.json()
        const workouts = await workoutsResponse.json()
        const nutrition = await nutritionResponse.json()
        
        // Calculate total volume for the day
        let totalVolume = 0
        if (workouts.length > 0) {
          totalVolume = workouts.reduce((total: number, workout: Workout) => {
            const sets = JSON.parse(workout.sets)
            return total + sets.reduce((setTotal: number, set: {reps: number, weight: number}) => {
              return setTotal + (set.reps * set.weight)
            }, 0)
          }, 0)
        }

        weeklyStats.push({
          day: format(dates[i], 'EEE'), // Mon, Tue, etc.
          calories: stats.nutrition?.calories || 0,
          protein: stats.nutrition?.protein || 0,
          carbs: stats.nutrition?.carbs || 0,
          fats: stats.nutrition?.fats || 0,
          volume: totalVolume
        })
      }
      
      setWeeklyData(weeklyStats)
      
      // Calculate monthly stats (using last 30 days of data)
      const monthlyEndDate = new Date()
      const monthlyStartDate = subDays(monthlyEndDate, 29)
      
      const monthlyStatsPromises = []
      for (let i = 0; i < 30; i++) {
        const date = subDays(monthlyEndDate, i)
        monthlyStatsPromises.push(
          fetch(`/api/stats?date=${format(date, 'yyyy-MM-dd')}`),
          fetch(`/api/workouts?date=${format(date, 'yyyy-MM-dd')}`)
        )
      }
      
      const monthlyResponses = await Promise.all(monthlyStatsPromises)
      
      let totalCalories = 0
      let totalProtein = 0
      let totalCarbs = 0
      let totalFats = 0
      let totalWorkouts = 0
      let totalVolume = 0
      let workoutDays = 0
      
      for (let i = 0; i < 30; i++) {
        const statsResponse = monthlyResponses[i * 2]
        const workoutsResponse = monthlyResponses[i * 2 + 1]
        
        const stats = await statsResponse.json()
        const workouts = await workoutsResponse.json()
        
        totalCalories += stats.nutrition?.calories || 0
        totalProtein += stats.nutrition?.protein || 0
        totalCarbs += stats.nutrition?.carbs || 0
        totalFats += stats.nutrition?.fats || 0
        
        if (workouts.length > 0) {
          totalWorkouts += workouts.length
          workoutDays++
          
          const dayVolume = workouts.reduce((dayTotal: number, workout: Workout) => {
            const sets = JSON.parse(workout.sets)
            return dayTotal + sets.reduce((setTotal: number, set: {reps: number, weight: number}) => {
              return setTotal + (set.reps * set.weight)
            }, 0)
          }, 0)
          totalVolume += dayVolume
        }
      }
      
      setMonthlyStats({
        avgCalories: Math.round(totalCalories / 30),
        avgProtein: Math.round((totalProtein / 30) * 10) / 10,
        avgCarbs: Math.round((totalCarbs / 30) * 10) / 10,
        avgFats: Math.round((totalFats / 30) * 10) / 10,
        totalWorkouts,
        totalVolume,
        avgVolumePerWorkout: workoutDays > 0 ? Math.round(totalVolume / workoutDays) : 0
      })
      
    } catch (error) {
      console.error('Error fetching progress data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProgressData()
  }, [])

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 mr-3" />
            <div>
              <h1 className="text-3xl font-bold">Progress</h1>
              <p className="text-primary-100 mt-1">Track your fitness journey over time</p>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Last 30 Days Overview</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{monthlyStats.avgCalories}</div>
                  <div className="text-sm text-gray-500">Avg Daily Calories</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">{monthlyStats.avgProtein}g</div>
                  <div className="text-sm text-gray-500">Avg Daily Protein</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{monthlyStats.totalWorkouts}</div>
                  <div className="text-sm text-gray-500">Total Workouts</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{monthlyStats.totalVolume.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Total Volume (kg)</div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Weekly Charts */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Last 7 Days Data</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className={i === 4 ? 'lg:col-span-2' : ''}>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Calories</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} cal`, 'Calories']} />
                      <Bar dataKey="calories" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Protein</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}g`, 'Protein']} />
                      <Bar dataKey="protein" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Carbs</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}g`, 'Carbs']} />
                      <Bar dataKey="carbs" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Fats</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}g`, 'Fats']} />
                      <Bar dataKey="fats" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Workout Volume</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value.toLocaleString()}kg`, 'Volume']} />
                      <Bar dataKey="volume" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Trends and Insights */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Insights</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <div className="animate-pulse">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-200 rounded mr-3"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card>
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Consistency</h3>
                    <p className="text-sm text-gray-500">
                      You've worked out {Math.round((monthlyStats.totalWorkouts / 30) * 7)} times per week on average
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Nutrition</h3>
                    <p className="text-sm text-gray-500">
                      Your average protein intake is {monthlyStats.avgProtein}g per day
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-red-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Strength</h3>
                    <p className="text-sm text-gray-500">
                      Average workout volume: {monthlyStats.avgVolumePerWorkout.toLocaleString()}kg
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Calories</h3>
                    <p className="text-sm text-gray-500">
                      Daily average: {monthlyStats.avgCalories} calories
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

      </div>
    </Layout>
  )
}
