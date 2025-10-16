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

    // Get active goals
    const activeGoals = await prisma.goal.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })

    // Get today's nutrition data
    const nutritionEntries = await prisma.nutrition.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })

    // Get today's workout data
    const workoutEntries = await prisma.workout.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })

    // Calculate current totals
    const currentTotals = {
      calories: nutritionEntries.reduce((sum, entry) => sum + entry.calories, 0),
      protein: nutritionEntries.reduce((sum, entry) => sum + entry.protein, 0),
      carbs: nutritionEntries.reduce((sum, entry) => sum + entry.carbs, 0),
      fats: nutritionEntries.reduce((sum, entry) => sum + entry.fats, 0),
      workouts: workoutEntries.length,
      volume: workoutEntries.reduce((sum, workout) => {
        const sets = JSON.parse(workout.sets as string)
        return sum + sets.reduce((setSum: number, set: {reps: number, weight: number}) => setSum + (set.reps * set.weight), 0)
      }, 0),
    }

    // Calculate progress for each goal
    const goalProgress = activeGoals.map(goal => {
      const progress = {
        calories: goal.calories ? Math.round((currentTotals.calories / goal.calories) * 100) : 0,
        protein: goal.protein ? Math.round((currentTotals.protein / goal.protein) * 100) : 0,
        carbs: goal.carbs ? Math.round((currentTotals.carbs / goal.carbs) * 100) : 0,
        fats: goal.fats ? Math.round((currentTotals.fats / goal.fats) * 100) : 0,
        workouts: goal.workouts ? Math.round((currentTotals.workouts / goal.workouts) * 100) : 0,
        volume: goal.volume ? Math.round((currentTotals.volume / goal.volume) * 100) : 0,
      }

      return {
        goal,
        current: currentTotals,
        progress,
      }
    })

    return NextResponse.json(goalProgress)
  } catch (error) {
    console.error('Error fetching goal progress:', error)
    return NextResponse.json({ message: 'Failed to fetch goal progress' }, { status: 500 })
  }
}
