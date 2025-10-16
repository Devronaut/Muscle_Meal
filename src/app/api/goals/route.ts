import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  return NextResponse.json({ message: 'Not available during build' }, { status: 503 })
}

export async function GET(request: Request) {
  try {
    // Return empty goals during build if database is not available
    return NextResponse.json([])
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json({ message: 'Failed to fetch goals' }, { status: 500 })
  }
}
