import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CreateGoalData } from '@/types'

export async function POST(request: Request) {
  try {
    const data: CreateGoalData = await request.json()
    
    const goal = await prisma.goal.create({
      data,
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json({ message: 'Failed to create goal' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const goals = await prisma.goal.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json({ message: 'Failed to fetch goals' }, { status: 500 })
  }
}
