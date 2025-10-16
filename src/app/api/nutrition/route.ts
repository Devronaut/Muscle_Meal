import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CreateNutritionData } from '@/types'
import { nutritionValidation } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body: CreateNutritionData = await request.json()
    console.log('Received nutrition data:', body)

    // Validate input
    const errors: { [key: string]: string | null } = {}
    errors.calories = nutritionValidation.calories(body.calories)
    errors.protein = nutritionValidation.protein(body.protein)
    errors.carbs = nutritionValidation.carbs(body.carbs)
    errors.fats = nutritionValidation.fats(body.fats)

    const hasErrors = Object.values(errors).some(error => error !== null)
    if (hasErrors) {
      console.log('Validation errors:', errors)
      return NextResponse.json({ errors }, { status: 400 })
    }

    // Ensure all numeric values are properly converted
    const nutritionData = {
      date: new Date(body.date),
      foodName: body.foodName || null,
      calories: parseInt(body.calories.toString()),
      protein: parseFloat(body.protein.toString()),
      carbs: parseFloat(body.carbs.toString()),
      fats: parseFloat(body.fats.toString()),
    }

    console.log('Creating nutrition entry with data:', nutritionData)

    const newNutrition = await prisma.nutrition.create({
      data: nutritionData,
    })

    console.log('Created nutrition entry:', newNutrition)
    return NextResponse.json(newNutrition, { status: 201 })
  } catch (error) {
    console.error('Error creating nutrition entry:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json({ 
      message: 'Failed to create nutrition entry',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    let nutritionEntries

    if (startDateParam && endDateParam) {
      // Get nutrition entries for a date range
      const startDate = new Date(startDateParam)
      const endDate = new Date(endDateParam)
      endDate.setUTCHours(23, 59, 59, 999)

      nutritionEntries = await prisma.nutrition.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { date: 'asc' },
      })
    } else if (dateParam) {
      // Fetch nutrition entries for a specific date
      const startOfDay = new Date(dateParam)
      startOfDay.setUTCHours(0, 0, 0, 0)
      const endOfDay = new Date(dateParam)
      endOfDay.setUTCHours(23, 59, 59, 999)

      nutritionEntries = await prisma.nutrition.findMany({
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
      // Fetch today's nutrition entries
      const today = new Date()
      const startOfDay = new Date(today)
      startOfDay.setUTCHours(0, 0, 0, 0)
      const endOfDay = new Date(today)
      endOfDay.setUTCHours(23, 59, 59, 999)

      nutritionEntries = await prisma.nutrition.findMany({
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

    return NextResponse.json(nutritionEntries)
  } catch (error) {
    console.error('Error fetching nutrition entries:', error)
    return NextResponse.json({ message: 'Failed to fetch nutrition entries' }, { status: 500 })
  }
}
