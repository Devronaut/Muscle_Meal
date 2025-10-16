import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CreateGoalData } from '@/types'

export async function POST(request: Request) {
  try {
    const body: CreateGoalData = await request.json()
    console.log('Received goal data:', body)

    // Validate input
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Goal name is required' }, { status: 400 })
    }

    if (!body.type || !['daily', 'weekly'].includes(body.type)) {
      return NextResponse.json({ error: 'Goal type must be daily or weekly' }, { status: 400 })
    }

    if (!body.category || !['nutrition', 'workout'].includes(body.category)) {
      return NextResponse.json({ error: 'Goal category must be nutrition or workout' }, { status: 400 })
    }

    // Validate that at least one goal value is set
    const hasGoalValue = body.calories || body.protein || body.carbs || body.fats || body.workouts || body.volume
    if (!hasGoalValue) {
      return NextResponse.json({ error: 'At least one goal value must be set' }, { status: 400 })
    }

    // Deactivate any existing goals of the same type and category
    await prisma.goal.updateMany({
      where: {
        type: body.type,
        category: body.category,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    })

    const newGoal = await prisma.goal.create({
      data: {
        name: body.name,
        type: body.type,
        category: body.category,
        calories: body.calories,
        protein: body.protein,
        carbs: body.carbs,
        fats: body.fats,
        workouts: body.workouts,
        volume: body.volume,
        isActive: body.isActive ?? true,
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    })

    console.log('Created goal:', newGoal)
    return NextResponse.json(newGoal, { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json({ 
      message: 'Failed to create goal',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    const goals = await prisma.goal.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json({ message: 'Failed to fetch goals' }, { status: 500 })
  }
}
