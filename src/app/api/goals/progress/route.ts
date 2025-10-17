import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { GoalProgress } from '@/types'

export async function GET(request: Request) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get active goals
    const goals = await prisma.goal.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })

    // Get today's data
    const [workouts, nutrition] = await Promise.all([
      prisma.workout.findMany({
        where: {
          date: { gte: today, lt: tomorrow },
        },
      }),
      prisma.nutrition.findMany({
        where: {
          date: { gte: today, lt: tomorrow },
        },
      }),
    ])

    // Calculate current values
    const current = {
      calories: nutrition.reduce((sum, n) => sum + n.calories, 0),
      protein: nutrition.reduce((sum, n) => sum + n.protein, 0),
      carbs: nutrition.reduce((sum, n) => sum + n.carbs, 0),
      fats: nutrition.reduce((sum, n) => sum + n.fats, 0),
      workouts: workouts.length,
      volume: workouts.reduce((sum, w) => {
        const sets = typeof w.sets === 'string' ? JSON.parse(w.sets) : w.sets
        return sum + sets.reduce((setSum: number, set: any) => setSum + (set.reps * set.weight), 0)
      }, 0),
    }

    // Calculate progress for each goal
    const goalProgress = goals.map(goal => {
      const progress = {
        calories: goal.calories ? (current.calories / goal.calories) * 100 : 0,
        protein: goal.protein ? (current.protein / goal.protein) * 100 : 0,
        carbs: goal.carbs ? (current.carbs / goal.carbs) * 100 : 0,
        fats: goal.fats ? (current.fats / goal.fats) * 100 : 0,
        workouts: goal.workouts ? (current.workouts / goal.workouts) * 100 : 0,
        volume: goal.volume ? (current.volume / goal.volume) * 100 : 0,
      }

      return {
        goal: {
          ...goal,
          type: goal.type as 'daily' | 'weekly',
          category: goal.category as 'nutrition' | 'workout',
        },
        current,
        progress,
      }
    })

    return NextResponse.json(goalProgress)
  } catch (error) {
    console.error('Error fetching goal progress:', error)
    return NextResponse.json({ message: 'Failed to fetch goal progress' }, { status: 500 })
  }
}
