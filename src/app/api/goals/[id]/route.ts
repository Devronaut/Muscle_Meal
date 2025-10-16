import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id: params.id },
    })

    if (!goal) {
      return NextResponse.json({ message: 'Goal not found' }, { status: 404 })
    }

    return NextResponse.json(goal)
  } catch (error) {
    console.error('Error fetching goal:', error)
    return NextResponse.json({ message: 'Failed to fetch goal' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

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

    const updatedGoal = await prisma.goal.update({
      where: { id: params.id },
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
        isActive: body.isActive,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
      },
    })

    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json({ message: 'Failed to update goal' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.goal.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Goal deleted successfully' })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json({ message: 'Failed to delete goal' }, { status: 500 })
  }
}
