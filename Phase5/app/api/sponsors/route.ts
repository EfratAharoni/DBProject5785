// app/api/sponsors/route.ts
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
        sponsorid,
        sponsorname,
        payment
      FROM sponsor 
      ORDER BY sponsorid ASC
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
        error: 'Failed to fetch sponsors' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sponsorname, payment } = body

    // Validation
    if (!sponsorname || sponsorname.trim() === '') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Sponsor name is required' 
        },
        { status: 400 }
      )
    }

    if (payment && payment < 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Payment amount cannot be negative' 
        },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    
    try {
      const query = `
        INSERT INTO sponsor (sponsorname, payment)
        VALUES ($1, $2)
        RETURNING *
      `
      
      const values = [
        sponsorname.trim(), 
        payment ? parseFloat(payment) : null
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
        error: 'Failed to create sponsor. Please check your input and try again.' 
      },
      { status: 500 }
    )
  }
}