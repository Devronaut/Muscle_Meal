import { prisma } from '@/lib/db'
import { calculateWorkoutVolume } from '@/lib/utils'
import { WorkoutSet } from '@/types'

// Analytics interfaces
export interface TrendData {
  period: string
  calories: number
  protein: number
  carbs: number
  fats: number
  workoutVolume: number
  workoutCount: number
}

export interface PerformancePattern {
  bestDay: string
  mostConsistentDay: string
  averageWorkoutsPerWeek: number
  consistencyScore: number
  improvementRate: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
  category: 'streak' | 'milestone' | 'improvement' | 'consistency'
}

export interface PersonalRecord {
  exerciseName: string
  recordType: 'maxWeight' | 'maxVolume' | 'maxReps'
  value: number
  date: Date
  previousRecord?: number
}

// Get trend data for the last 8 weeks
export async function getTrendData(): Promise<TrendData[]> {
  const weeks = []
  const today = new Date()
  
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - (i * 7) - 6)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    
    // Get nutrition data for this week
    const nutrition = await prisma.nutrition.findMany({
      where: {
        date: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    })
    
    // Get workout data for this week
    const workouts = await prisma.workout.findMany({
      where: {
        date: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    })
    
    const weekData: TrendData = {
      period: `Week ${8 - i}`,
      calories: nutrition.reduce((sum, n) => sum + n.calories, 0),
      protein: nutrition.reduce((sum, n) => sum + n.protein, 0),
      carbs: nutrition.reduce((sum, n) => sum + n.carbs, 0),
      fats: nutrition.reduce((sum, n) => sum + n.fats, 0),
      workoutVolume: workouts.reduce((sum, w) => {
        const sets = typeof w.sets === 'string' ? JSON.parse(w.sets) : w.sets
        return sum + calculateWorkoutVolume(sets)
      }, 0),
      workoutCount: workouts.length,
    }
    
    weeks.push(weekData)
  }
  
  return weeks
}

// Calculate performance patterns
export async function getPerformancePatterns(): Promise<PerformancePattern> {
  const last30Days = new Date()
  last30Days.setDate(last30Days.getDate() - 30)
  
  const workouts = await prisma.workout.findMany({
    where: {
      date: {
        gte: last30Days,
      },
    },
  })
  
  // Group workouts by day of week
  const dayStats = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  }
  
  workouts.forEach(workout => {
    const dayName = workout.date.toLocaleDateString('en-US', { weekday: 'long' })
    dayStats[dayName as keyof typeof dayStats]++
  })
  
  // Find best day (most workouts)
  const bestDay = Object.entries(dayStats).reduce((a, b) => 
    dayStats[a[0] as keyof typeof dayStats] > dayStats[b[0] as keyof typeof dayStats] ? a : b
  )[0]
  
  // Find most consistent day (least variance)
  const dayValues = Object.values(dayStats)
  const mean = dayValues.reduce((sum, val) => sum + val, 0) / dayValues.length
  const variance = dayValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / dayValues.length
  const consistencyScore = Math.max(0, 100 - (variance * 10))
  
  // Calculate improvement rate (simplified)
  const totalWorkouts = workouts.length
  const improvementRate = Math.min(100, (totalWorkouts / 30) * 100)
  
  return {
    bestDay,
    mostConsistentDay: bestDay, // Simplified for now
    averageWorkoutsPerWeek: totalWorkouts / 4.3, // ~4.3 weeks in 30 days
    consistencyScore,
    improvementRate,
  }
}

// Get achievement badges
export async function getAchievements(): Promise<Achievement[]> {
  const achievements: Achievement[] = []
  const today = new Date()
  
  // Check for streaks
  const last7Days = new Date()
  last7Days.setDate(today.getDate() - 7)
  
  const recentWorkouts = await prisma.workout.findMany({
    where: {
      date: {
        gte: last7Days,
      },
    },
  })
  
  // 7-day workout streak
  if (recentWorkouts.length >= 7) {
    achievements.push({
      id: 'streak-7',
      name: '7-Day Warrior',
      description: 'Worked out for 7 consecutive days!',
      icon: '🔥',
      unlockedAt: today,
      category: 'streak',
    })
  }
  
  // Check for nutrition consistency
  const recentNutrition = await prisma.nutrition.findMany({
    where: {
      date: {
        gte: last7Days,
      },
    },
  })
  
  if (recentNutrition.length >= 14) { // 2 meals per day average
    achievements.push({
      id: 'nutrition-consistent',
      name: 'Nutrition Master',
      description: 'Logged nutrition consistently for a week!',
      icon: '🍎',
      unlockedAt: today,
      category: 'consistency',
    })
  }
  
  // Check for volume milestones
  const totalVolume = recentWorkouts.reduce((sum, w) => {
    const sets = typeof w.sets === 'string' ? JSON.parse(w.sets) : w.sets
    return sum + calculateWorkoutVolume(sets)
  }, 0)
  
  if (totalVolume >= 10000) { // 10,000 kg total volume
    achievements.push({
      id: 'volume-milestone',
      name: 'Volume Beast',
      description: 'Lifted over 10,000 kg this week!',
      icon: '💪',
      unlockedAt: today,
      category: 'milestone',
    })
  }
  
  return achievements
}

// Get personal records
export async function getPersonalRecords(): Promise<PersonalRecord[]> {
  const workouts = await prisma.workout.findMany({
    orderBy: { date: 'desc' },
  })
  
  const records: PersonalRecord[] = []
  const exerciseRecords = new Map<string, { maxWeight: number, maxVolume: number, maxReps: number, date: Date }>()
  
  workouts.forEach(workout => {
    const sets = typeof workout.sets === 'string' ? JSON.parse(workout.sets) : workout.sets
    const exerciseName = workout.exerciseName
    
    if (!exerciseRecords.has(exerciseName)) {
      exerciseRecords.set(exerciseName, {
        maxWeight: 0,
        maxVolume: 0,
        maxReps: 0,
        date: workout.date,
      })
    }
    
    const current = exerciseRecords.get(exerciseName)!
    
    // Check for max weight
    const maxWeight = Math.max(...sets.map((s: WorkoutSet) => s.weight))
    if (maxWeight > current.maxWeight) {
      current.maxWeight = maxWeight
      current.date = workout.date
    }
    
    // Check for max volume
    const volume = calculateWorkoutVolume(sets)
    if (volume > current.maxVolume) {
      current.maxVolume = volume
      current.date = workout.date
    }
    
    // Check for max reps
    const maxReps = Math.max(...sets.map((s: WorkoutSet) => s.reps))
    if (maxReps > current.maxReps) {
      current.maxReps = maxReps
      current.date = workout.date
    }
  })
  
  // Convert to PersonalRecord format
  exerciseRecords.forEach((record, exerciseName) => {
    if (record.maxWeight > 0) {
      records.push({
        exerciseName,
        recordType: 'maxWeight',
        value: record.maxWeight,
        date: record.date,
      })
    }
    
    if (record.maxVolume > 0) {
      records.push({
        exerciseName,
        recordType: 'maxVolume',
        value: record.maxVolume,
        date: record.date,
      })
    }
    
    if (record.maxReps > 0) {
      records.push({
        exerciseName,
        recordType: 'maxReps',
        value: record.maxReps,
        date: record.date,
      })
    }
  })
  
  return records.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10) // Top 10 recent records
}

// Calculate improvement percentages
export function calculateImprovements(trendData: TrendData[]): {
  caloriesImprovement: number
  proteinImprovement: number
  workoutVolumeImprovement: number
  workoutCountImprovement: number
} {
  if (trendData.length < 2) {
    return {
      caloriesImprovement: 0,
      proteinImprovement: 0,
      workoutVolumeImprovement: 0,
      workoutCountImprovement: 0,
    }
  }
  
  const firstWeek = trendData[0]
  const lastWeek = trendData[trendData.length - 1]
  
  const calculateImprovement = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }
  
  return {
    caloriesImprovement: calculateImprovement(lastWeek.calories, firstWeek.calories),
    proteinImprovement: calculateImprovement(lastWeek.protein, firstWeek.protein),
    workoutVolumeImprovement: calculateImprovement(lastWeek.workoutVolume, firstWeek.workoutVolume),
    workoutCountImprovement: calculateImprovement(lastWeek.workoutCount, firstWeek.workoutCount),
  }
}
