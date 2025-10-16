import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { nutritionValidation } from '@/lib/validations'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const nutrition = await prisma.nutrition.findUnique({
      where: { id: params.id },
    })

    if (!nutrition) {
      return NextResponse.json({ message: 'Nutrition entry not found' }, { status: 404 })
    }

    return NextResponse.json(nutrition)
  } catch (error) {
    console.error('Error fetching nutrition entry:', error)
    return NextResponse.json({ message: 'Failed to fetch nutrition entry' }, { status: 500 })
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
    errors.calories = nutritionValidation.calories(body.calories)
    errors.protein = nutritionValidation.protein(body.protein)
    errors.carbs = nutritionValidation.carbs(body.carbs)
    errors.fats = nutritionValidation.fats(body.fats)

    const hasErrors = Object.values(errors).some(error => error !== null)
    if (hasErrors) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    const updatedNutrition = await prisma.nutrition.update({
      where: { id: params.id },
      data: {
        date: new Date(body.date),
        foodName: body.foodName,
        calories: body.calories,
        protein: body.protein,
        carbs: body.carbs,
        fats: body.fats,
      },
    })

    return NextResponse.json(updatedNutrition)
  } catch (error) {
    console.error('Error updating nutrition entry:', error)
    return NextResponse.json({ message: 'Failed to update nutrition entry' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.nutrition.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Nutrition entry deleted successfully' })
  } catch (error) {
    console.error('Error deleting nutrition entry:', error)
    return NextResponse.json({ message: 'Failed to delete nutrition entry' }, { status: 500 })
  }
}
