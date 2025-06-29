// app/api/venues/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'mydatabase',
  user: 'avishaco',
  password: 'ac325277457',
})

export async function GET() {
  try {
    const client = await pool.connect()
    
    const query = `
      SELECT 
        venid,
        venname,
        location,
        capacity,
        venudescription,
        rental_price,
        parking
      FROM venue 
      ORDER BY venid ASC
    `
    
    const result = await client.query(query)
    client.release()
    
    return NextResponse.json({
      success: true,
      data: result.rows
    })
    
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch venues' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { venname, location, capacity, venudescription, rental_price, parking } = body

    // Validation
    if (!venname || !capacity) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Venue name and capacity are required' 
        },
        { status: 400 }
      )
    }

    if (capacity <= 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Capacity must be greater than 0' 
        },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    
    try {
      // Get next venue ID
      const idResult = await client.query('SELECT COALESCE(MAX(venid), 0) + 1 as next_id FROM venue')
      const nextId = idResult.rows[0].next_id
      
      const query = `
        INSERT INTO venue (venid, venname, location, capacity, venudescription, rental_price, parking)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `
      
      const values = [
        nextId, 
        venname.trim(), 
        location?.trim() || null, 
        parseInt(capacity), 
        venudescription?.trim() || null, 
        rental_price ? parseFloat(rental_price) : null, 
        parking?.trim() || null
      ]
      
      const result = await client.query(query, values)
      
      return NextResponse.json({
        success: true,
        data: result.rows[0]
      }, { status: 201 })
      
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create venue. Please check your input and try again.' 
      },
      { status: 500 }
    )
  }
}