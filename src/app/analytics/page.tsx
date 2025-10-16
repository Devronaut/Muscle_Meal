'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { 
  ChartBarIcon, 
  TrophyIcon, 
  FireIcon, 
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import { AnalyticsData, TrendData, Achievement, PersonalRecord } from '@/types'

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      } else {
        console.error('Failed to fetch analytics:', response.status, response.statusText)
        setAnalyticsData(null)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setAnalyticsData(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const formatImprovement = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  const getImprovementColor = (value: number) => {
    if (value > 0) return 'text-green-600'
    if (value < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getRecordTypeLabel = (type: string) => {
    switch (type) {
      case 'maxWeight': return 'Max Weight'
      case 'maxVolume': return 'Max Volume'
      case 'maxReps': return 'Max Reps'
      default: return type
    }
  }

  const getAchievementColor = (category: string) => {
    switch (category) {
      case 'streak': return 'bg-orange-100 text-orange-800'
      case 'milestone': return 'bg-purple-100 text-purple-800'
      case 'improvement': return 'bg-green-100 text-green-800'
      case 'consistency': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-3xl font-bold">Analytics & Insights</h1>
                <p className="text-primary-100 mt-1">Deep dive into your fitness data</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  // Check if analytics data is empty or unavailable
  const hasNoData = !analyticsData || (
    analyticsData.trends.length === 0 &&
    analyticsData.achievements.length === 0 &&
    analyticsData.personalRecords.length === 0 &&
    analyticsData.summary.totalWeeks === 0
  )

  if (hasNoData) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-3xl font-bold">Analytics & Insights</h1>
                <p className="text-primary-100 mt-1">Deep dive into your fitness data</p>
              </div>
            </div>
          </div>
          
          <Card>
            <div className="text-center py-12">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-500">Start logging workouts and nutrition to see your analytics!</p>
              <div className="mt-4">
                <p className="text-sm text-gray-400">Note: Analytics require a production database setup to function properly.</p>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 mr-3" />
            <div>
              <h1 className="text-3xl font-bold">Analytics & Insights</h1>
              <p className="text-primary-100 mt-1">Deep dive into your fitness data</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-blue-500">
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Consistency Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.patterns.consistencyScore.toFixed(0)}%
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
                  {analyticsData.summary.totalAchievements}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-purple-500">
            <div className="flex items-center">
              <StarIcon className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Personal Records</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.summary.totalRecords}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-orange-500">
            <div className="flex items-center">
              <CalendarDaysIcon className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Best Day</p>
                <p className="text-lg font-bold text-gray-900">
                  {analyticsData.patterns.bestDay}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Improvement Trends */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Calories"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="workoutVolume" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Workout Volume"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Improvement Rates</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FireIcon className="h-5 w-5 text-red-600 mr-2" />
                  <span className="font-medium">Workout Volume</span>
                </div>
                <span className={`font-bold ${getImprovementColor(analyticsData.improvements.workoutVolumeImprovement)}`}>
                  {formatImprovement(analyticsData.improvements.workoutVolumeImprovement)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium">Calories</span>
                </div>
                <span className={`font-bold ${getImprovementColor(analyticsData.improvements.caloriesImprovement)}`}>
                  {formatImprovement(analyticsData.improvements.caloriesImprovement)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <TrophyIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium">Protein</span>
                </div>
                <span className={`font-bold ${getImprovementColor(analyticsData.improvements.proteinImprovement)}`}>
                  {formatImprovement(analyticsData.improvements.proteinImprovement)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="font-medium">Workout Count</span>
                </div>
                <span className={`font-bold ${getImprovementColor(analyticsData.improvements.workoutCountImprovement)}`}>
                  {formatImprovement(analyticsData.improvements.workoutCountImprovement)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Achievements and Personal Records */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Achievements</h3>
            {analyticsData.achievements.length > 0 ? (
              <div className="space-y-3">
                {analyticsData.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mr-3">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAchievementColor(achievement.category)}`}>
                          {achievement.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Keep working out to unlock achievements!</p>
              </div>
            )}
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Records</h3>
            {analyticsData.personalRecords.length > 0 ? (
              <div className="space-y-3">
                {analyticsData.personalRecords.slice(0, 5).map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{record.exerciseName}</h4>
                      <p className="text-sm text-gray-600">{getRecordTypeLabel(record.recordType)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {record.value.toLocaleString()}
                        {record.recordType === 'maxWeight' ? ' kg' : 
                         record.recordType === 'maxVolume' ? ' kg' : ' reps'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Start logging workouts to track your records!</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  )
}
