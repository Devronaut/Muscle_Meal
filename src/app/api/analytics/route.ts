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
    // Fetch all analytics data in parallel
    const [trendData, performancePatterns, achievements, personalRecords] = await Promise.all([
      getTrendData(),
      getPerformancePatterns(),
      getAchievements(),
      getPersonalRecords(),
    ])
    
    // Calculate improvements
    const improvements = calculateImprovements(trendData)
    
    const analytics = {
      trends: trendData,
      patterns: performancePatterns,
      achievements,
      personalRecords,
      improvements,
      summary: {
        totalWeeks: trendData.length,
        totalAchievements: achievements.length,
        totalRecords: personalRecords.length,
        averageConsistency: performancePatterns.consistencyScore,
      }
    }
    
    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ message: 'Failed to fetch analytics' }, { status: 500 })
  }
}
