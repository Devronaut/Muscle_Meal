import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CreateWorkoutData } from '@/types'
import { workoutValidation } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body: CreateWorkoutData = await request.json()

    // Validate input
    const errors: { [key: string]: string | null } = {}
    errors.exerciseName = workoutValidation.exerciseName(body.exerciseName)
    errors.sets = workoutValidation.sets(body.sets)

    const hasErrors = Object.values(errors).some(error => error !== null)
    if (hasErrors) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    const newWorkout = await prisma.workout.create({
      data: {
        date: new Date(body.date),
        exerciseName: body.exerciseName,
        sets: JSON.stringify(body.sets),
        notes: body.notes,
      },
    })

    // Parse the sets back for the response
    const responseWorkout = {
      ...newWorkout,
      sets: JSON.parse(newWorkout.sets as string)
    }

    return NextResponse.json(responseWorkout, { status: 201 })
  } catch (error) {
    console.error('Error creating workout:', error)
    return NextResponse.json({ message: 'Failed to create workout' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    let workouts

    if (startDateParam && endDateParam) {
      // Get workouts for a date range
      const startDate = new Date(startDateParam)
      const endDate = new Date(endDateParam)
      endDate.setUTCHours(23, 59, 59, 999)

      workouts = await prisma.workout.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { date: 'asc' },
      })
    } else if (dateParam) {
      // Fetch workouts for a specific date
      const startOfDay = new Date(dateParam)
      startOfDay.setUTCHours(0, 0, 0, 0)
      const endOfDay = new Date(dateParam)
      endOfDay.setUTCHours(23, 59, 59, 999)

      workouts = await prisma.workout.findMany({
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      // Fetch today's workouts
      const today = new Date()
      const startOfDay = new Date(today)
      startOfDay.setUTCHours(0, 0, 0, 0)
      const endOfDay = new Date(today)
      endOfDay.setUTCHours(23, 59, 59, 999)

      workouts = await prisma.workout.findMany({
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    // Parse JSON sets back to array for each workout
    const workoutsWithParsedSets = workouts.map(workout => ({
      ...workout,
      sets: JSON.parse(workout.sets as string)
    }))

    return NextResponse.json(workoutsWithParsedSets)
  } catch (error) {
    console.error('Error fetching workouts:', error)
    return NextResponse.json({ message: 'Failed to fetch workouts' }, { status: 500 })
  }
}