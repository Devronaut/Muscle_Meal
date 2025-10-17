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
    // Fetch all analytics data
    const [trends, patterns, achievements, personalRecords] = await Promise.all([
      getTrendData(),
      getPerformancePatterns(),
      getAchievements(),
      getPersonalRecords(),
    ])

    // Calculate improvements
    const improvements = calculateImprovements(trends)

    // Build analytics response
    const analytics = {
      trends,
      patterns,
      achievements,
      personalRecords,
      improvements,
      summary: {
        totalWeeks: trends.length,
        totalAchievements: achievements.length,
        totalRecords: personalRecords.length,
        averageConsistency: patterns.consistencyScore,
      }
    }
    
    return NextResponse.json(analytics, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ 
      message: 'Failed to fetch analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
