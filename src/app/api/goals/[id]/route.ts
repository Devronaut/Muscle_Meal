import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CreateGoalData } from '@/types'

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
    const data: Partial<CreateGoalData> = await request.json()
    
    const goal = await prisma.goal.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json(goal)
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
