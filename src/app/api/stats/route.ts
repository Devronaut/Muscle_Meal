import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getTodayRange } from '@/lib/utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    
    const targetDate = dateParam ? new Date(dateParam) : new Date()
    const startOfDay = new Date(targetDate)
    startOfDay.setUTCHours(0, 0, 0, 0)
    const endOfDay = new Date(targetDate)
    endOfDay.setUTCHours(23, 59, 59, 999)

    // Get workouts for the day
    const workouts = await prisma.workout.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })

    // Get nutrition entries for the day
    const nutritionEntries = await prisma.nutrition.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })

    // Calculate totals
    const totalWorkoutVolume = workouts.reduce((total, workout) => {
      const sets = JSON.parse(workout.sets as string)
      return total + sets.reduce((setTotal: number, set: {reps: number, weight: number}) => {
        return setTotal + (set.reps * set.weight)
      }, 0)
    }, 0)

    const totalNutrition = nutritionEntries.reduce(
      (totals, entry) => ({
        calories: totals.calories + entry.calories,
        protein: totals.protein + entry.protein,
        carbs: totals.carbs + entry.carbs,
        fats: totals.fats + entry.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    )

    const stats = {
      date: targetDate.toISOString().split('T')[0],
      workouts: workouts.length,
      totalWorkoutVolume,
      nutrition: totalNutrition,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ message: 'Failed to fetch stats' }, { status: 500 })
  }
}
