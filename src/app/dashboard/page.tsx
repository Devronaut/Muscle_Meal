'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, StatCard } from '@/components/ui/Card'
import { FireIcon, PlusIcon, ChartBarIcon, ArrowTrendingUpIcon, TrophyIcon } from '@heroicons/react/24/outline'
import { Workout, Nutrition, GoalProgress } from '@/types'
import { calculateWorkoutVolume, formatDateTime, getMotivationalMessage, calculateOverallProgress } from '@/lib/utils'

export default function DashboardPage() {
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    workoutVolume: 0,
    workoutsCount: 0
  })
  
  const [recentActivity, setRecentActivity] = useState<Array<{
    type: 'workout' | 'nutrition'
    title: string
    description: string
    time: string
    icon: React.ReactNode
  }>>([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [goalProgress, setGoalProgress] = useState<GoalProgress[]>([])
  const [analyticsInsights, setAnalyticsInsights] = useState<{
    achievements: number
    consistencyScore: number
    bestDay: string
    totalRecords: number
  } | null>(null)

  const fetchTodayData = async () => {
    try {
      const [statsResponse, workoutsResponse, nutritionResponse, goalsResponse, analyticsResponse] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/workouts'),
        fetch('/api/nutrition'),
        fetch('/api/goals/progress'),
        fetch('/api/analytics')
      ])

      if (statsResponse.ok && workoutsResponse.ok && nutritionResponse.ok && goalsResponse.ok) {
        const [stats, workouts, nutrition, goals, analytics] = await Promise.all([
          statsResponse.json(),
          workoutsResponse.json(),
          nutritionResponse.json(),
          goalsResponse.json(),
          analyticsResponse.ok ? analyticsResponse.json() : Promise.resolve(null)
        ])

        setTodayStats({
          calories: stats.nutrition.calories,
          protein: stats.nutrition.protein,
          carbs: stats.nutrition.carbs,
          fats: stats.nutrition.fats,
          workoutVolume: stats.totalWorkoutVolume,
          workoutsCount: stats.workouts
        })

        setGoalProgress(goals)

        // Set analytics insights
        if (analytics) {
          setAnalyticsInsights({
            achievements: analytics.summary.totalAchievements,
            consistencyScore: analytics.patterns.consistencyScore,
            bestDay: analytics.patterns.bestDay,
            totalRecords: analytics.summary.totalRecords
          })
        }

        // Create recent activity
        const activities = []
        
        // Add recent workouts
        workouts.slice(0, 3).forEach((workout: Workout) => {
          const volume = calculateWorkoutVolume(workout.sets)
          activities.push({
            type: 'workout' as const,
            title: workout.exerciseName,
            description: `${workout.sets.length} sets, ${volume.toLocaleString()}kg total`,
            time: formatDateTime(new Date(workout.createdAt)),
            icon: <FireIcon className="h-5 w-5 text-red-500" />
          })
        })

        // Add recent nutrition entries
        nutrition.slice(0, 3).forEach((entry: Nutrition) => {
          activities.push({
            type: 'nutrition' as const,
            title: entry.foodName || 'Nutrition Entry',
            description: `${entry.calories} cal, ${entry.protein}g protein`,
            time: formatDateTime(new Date(entry.createdAt)),
            icon: <PlusIcon className="h-5 w-5 text-green-500" />
          })
        })

        // Sort by creation time (most recent first) and take first 5
        activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        setRecentActivity(activities.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTodayData()
  }, [])

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-primary-100 mt-1">Today's fitness overview</p>
            </div>
            <div className="hidden sm:block">
              <div className="text-right">
                <div className="text-2xl font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
                <div className="text-primary-100">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Stats */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Progress</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard
                title="Calories"
                value={todayStats.calories}
                subtitle={goalProgress[0]?.goal.calories ? `/ ${goalProgress[0].goal.calories}` : ''}
                icon={<PlusIcon className="h-6 w-6 text-primary-600" />}
                className="border-l-4 border-primary-500"
              />
              <StatCard
                title="Protein (g)"
                value={todayStats.protein}
                subtitle={goalProgress[0]?.goal.protein ? `/ ${goalProgress[0].goal.protein}` : ''}
                icon={<PlusIcon className="h-6 w-6 text-success-600" />}
                className="border-l-4 border-success-500"
              />
              <StatCard
                title="Carbs (g)"
                value={todayStats.carbs}
                subtitle={goalProgress[0]?.goal.carbs ? `/ ${goalProgress[0].goal.carbs}` : ''}
                icon={<PlusIcon className="h-6 w-6 text-warning-600" />}
                className="border-l-4 border-warning-500"
              />
              <StatCard
                title="Fats (g)"
                value={todayStats.fats}
                subtitle={goalProgress[0]?.goal.fats ? `/ ${goalProgress[0].goal.fats}` : ''}
                icon={<PlusIcon className="h-6 w-6 text-orange-600" />}
                className="border-l-4 border-orange-500"
              />
              <StatCard
                title="Workout Volume"
                value={todayStats.workoutVolume.toLocaleString()}
                subtitle="kg"
                icon={<FireIcon className="h-6 w-6 text-red-600" />}
                className="border-l-4 border-red-500"
              />
            </div>
          )}
        </div>

        {/* Performance Insights */}
        {!isLoading && goalProgress.length > 0 && (() => {
          const overallProgress = calculateOverallProgress(goalProgress)
          const motivational = getMotivationalMessage(overallProgress)
          
          return (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h2>
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">
                    {motivational.emoji}
                  </div>
                  <div className="flex-1">
                    <p className={`text-lg font-medium ${motivational.color}`}>
                      {motivational.message}
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Overall Progress:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.min(overallProgress, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {overallProgress.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )
        })()}

        {/* Analytics Insights */}
        {!isLoading && analyticsInsights && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Insights</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-l-4 border-blue-500">
                <div className="flex items-center">
                  <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Consistency</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsInsights.consistencyScore.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-l-4 border-green-500">
                <div className="flex items-center">
                  <TrophyIcon className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Achievements</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsInsights.achievements}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-l-4 border-purple-500">
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Personal Records</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsInsights.totalRecords}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-l-4 border-orange-500">
                <div className="flex items-center">
                  <FireIcon className="h-8 w-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Best Day</p>
                    <p className="text-lg font-bold text-gray-900">
                      {analyticsInsights.bestDay}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="group hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Log Workout</h3>
                  <p className="text-sm text-gray-500">Add today's exercise session</p>
                </div>
                <div className="p-3 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors duration-200">
                  <FireIcon className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <div className="mt-4">
                <button className="btn btn-primary w-full">
                  Add Workout
                </button>
              </div>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Log Nutrition</h3>
                  <p className="text-sm text-gray-500">Track your daily intake</p>
                </div>
                <div className="p-3 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors duration-200">
                  <PlusIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <button className="btn btn-success w-full">
                  Add Nutrition
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <Card>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="h-5 w-5 bg-gray-200 rounded mr-3 animate-pulse"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className={`flex items-center justify-between py-2 ${index < recentActivity.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex items-center">
                      {activity.icon}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.description}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No activity today
                </h3>
                <p className="text-gray-500">
                  Start logging your workouts and nutrition to see your activity here.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  )
}
