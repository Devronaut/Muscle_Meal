import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CreateWorkoutData } from '@/types'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const workout = await prisma.workout.findUnique({
      where: { id: params.id },
    })

    if (!workout) {
      return NextResponse.json({ message: 'Workout not found' }, { status: 404 })
    }

    return NextResponse.json(workout)
  } catch (error) {
    console.error('Error fetching workout:', error)
    return NextResponse.json({ message: 'Failed to fetch workout' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data: Partial<CreateWorkoutData> = await request.json()
    
    const workout = await prisma.workout.update({
      where: { id: params.id },
      data: {
        ...data,
        sets: data.sets as any, // Prisma handles JSON serialization
      },
    })

    return NextResponse.json(workout)
  } catch (error) {
    console.error('Error updating workout:', error)
    return NextResponse.json({ message: 'Failed to update workout' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.workout.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Workout deleted successfully' })
  } catch (error) {
    console.error('Error deleting workout:', error)
    return NextResponse.json({ message: 'Failed to delete workout' }, { status: 500 })
  }
}
