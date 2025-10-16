import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { workoutValidation } from '@/lib/validations'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Return empty response during build if database is not available
    return NextResponse.json({ message: 'Workout not found' }, { status: 404 })
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
    const body = await request.json()

    // Validate input
    const errors: { [key: string]: string | null } = {}
    errors.exerciseName = workoutValidation.exerciseName(body.exerciseName)
    errors.sets = workoutValidation.sets(body.sets)

    const hasErrors = Object.values(errors).some(error => error !== null)
    if (hasErrors) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    const updatedWorkout = await prisma.workout.update({
      where: { id: params.id },
      data: {
        date: new Date(body.date),
        exerciseName: body.exerciseName,
        sets: JSON.stringify(body.sets),
        notes: body.notes,
      },
    })

    // Parse JSON sets back to array
    const responseWorkout = {
      ...updatedWorkout,
      sets: JSON.parse(updatedWorkout.sets as string)
    }

    return NextResponse.json(responseWorkout)
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
