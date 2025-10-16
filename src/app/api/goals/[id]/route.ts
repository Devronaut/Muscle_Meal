import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Return empty response during build if database is not available
    return NextResponse.json({ message: 'Goal not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching goal:', error)
    return NextResponse.json({ message: 'Failed to fetch goal' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ message: 'Not available during build' }, { status: 503 })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ message: 'Not available during build' }, { status: 503 })
}
