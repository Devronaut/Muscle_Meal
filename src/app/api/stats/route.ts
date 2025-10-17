import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { calculateWorkoutVolume } from '@/lib/utils'

export async function GET(request: Request) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get today's workouts
    const workouts = await prisma.workout.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    // Get today's nutrition
    const nutrition = await prisma.nutrition.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    // Calculate stats
    const totalWorkoutVolume = workouts.reduce((total, workout) => {
      const sets = typeof workout.sets === 'string' ? JSON.parse(workout.sets) : workout.sets
      return total + calculateWorkoutVolume(sets)
    }, 0)

    const totalNutrition = nutrition.reduce(
      (total, entry) => ({
        calories: total.calories + entry.calories,
        protein: total.protein + entry.protein,
        carbs: total.carbs + entry.carbs,
        fats: total.fats + entry.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    )

    const stats = {
      date: today.toISOString().split('T')[0],
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
