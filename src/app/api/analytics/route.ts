import { NextResponse } from 'next/server'
import { 
  getTrendData, 
  getPerformancePatterns, 
  getAchievements, 
  getPersonalRecords,
  calculateImprovements,
  TrendData,
  PerformancePattern,
  Achievement,
  PersonalRecord
} from '@/lib/analytics'

export async function GET() {
  try {
    // Return empty analytics data if database is not available (e.g., during build)
    const analytics = {
      trends: [],
      patterns: {
        bestDay: 'Monday',
        mostConsistentDay: 'Monday',
        averageWorkoutsPerWeek: 0,
        consistencyScore: 0,
        improvementRate: 0
      },
      achievements: [],
      personalRecords: [],
      improvements: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        workoutVolume: 0
      },
      summary: {
        totalWeeks: 0,
        totalAchievements: 0,
        totalRecords: 0,
        averageConsistency: 0,
      }
    }
    
    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ message: 'Failed to fetch analytics' }, { status: 500 })
  }
}
