// app/api/performers/route.ts
import { NextRequest, NextResponse } from 'next/server'
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

// POST - Create new performer
export async function POST(request: NextRequest) {
  try {
    const { performername, perfcontactinfo } = await request.json()
    
    if (!performername) {
      return NextResponse.json(
        { success: false, error: 'Performer name is required' },
        { status: 400 }
      )
    }

    // Get next performer ID
    const idResult = await pool.query('SELECT COALESCE(MAX(performerid), 0) + 1 as next_id FROM performer')
    const nextId = idResult.rows[0].next_id

    // Insert new performer
    const insertQuery = `
      INSERT INTO performer (performerid, performername, perfcontactinfo)
      VALUES ($1, $2, $3)
      RETURNING *
    `
    
    const values = [nextId, performername.trim(), perfcontactinfo?.trim() || null]
    const result = await pool.query(insertQuery, values)
    
    return NextResponse.json({
      success: true,
      message: 'Performer created successfully',
      data: result.rows[0]
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating performer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create performer' },
      { status: 500 }
    )
  }
}