// app/api/performers/route.ts
import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// GET - Fetch all performers
export async function GET() {
  try {
    const query = `
      SELECT 
        performerid,
        performername,
        perfcontactinfo
      FROM performer
      ORDER BY performername ASC
    `
    
    const result = await pool.query(query)
    
    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching performers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch performers' },
      { status: 500 }
    )
  }
}