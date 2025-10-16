import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Return empty goal progress during build if database is not available
    return NextResponse.json([])
  } catch (error) {
    console.error('Error fetching goal progress:', error)
    return NextResponse.json({ message: 'Failed to fetch goal progress' }, { status: 500 })
  }
}
