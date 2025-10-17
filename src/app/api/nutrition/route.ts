import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CreateNutritionData } from '@/types'

export async function POST(request: Request) {
  try {
    const data: CreateNutritionData = await request.json()
    
    const nutrition = await prisma.nutrition.create({
      data,
    })

    return NextResponse.json(nutrition, { status: 201 })
  } catch (error) {
    console.error('Error creating nutrition entry:', error)
    return NextResponse.json({ message: 'Failed to create nutrition entry' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const nutrition = await prisma.nutrition.findMany({
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(nutrition)
  } catch (error) {
    console.error('Error fetching nutrition entries:', error)
    return NextResponse.json({ message: 'Failed to fetch nutrition entries' }, { status: 500 })
  }
}