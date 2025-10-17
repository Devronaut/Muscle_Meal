import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CreateWorkoutData } from '@/types'

export async function POST(request: Request) {
  try {
    const data: CreateWorkoutData = await request.json()
    
    const workout = await prisma.workout.create({
      data: {
        ...data,
        sets: data.sets as any, // Prisma handles JSON serialization
      },
    })

    return NextResponse.json(workout, { status: 201 })
  } catch (error) {
    console.error('Error creating workout:', error)
    return NextResponse.json({ message: 'Failed to create workout' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const workouts = await prisma.workout.findMany({
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(workouts)
  } catch (error) {
    console.error('Error fetching workouts:', error)
    return NextResponse.json({ message: 'Failed to fetch workouts' }, { status: 500 })
  }
}