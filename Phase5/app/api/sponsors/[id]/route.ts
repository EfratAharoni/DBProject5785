// app/api/sponsors/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'mydatabase',
  user: 'avishaco',
  password: 'ac325277457',
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sponsorid = parseInt(params.id)
    
    if (isNaN(sponsorid)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid sponsor ID' 
        },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    
    try {
      const query = 'SELECT * FROM sponsor WHERE sponsorid = $1'
      const result = await client.query(query, [sponsorid])
      
      if (result.rows.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Sponsor not found' 
          },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        data: result.rows[0]
      })
      
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch sponsor' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sponsorid = parseInt(params.id)
    
    if (isNaN(sponsorid)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid sponsor ID' 
        },
        { status: 400 }
      )
    }

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

    if (payment && parseFloat(payment) < 0) {
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
      // Check if sponsor exists
      const checkQuery = 'SELECT sponsorid FROM sponsor WHERE sponsorid = $1'
      const checkResult = await client.query(checkQuery, [sponsorid])
      
      if (checkResult.rows.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Sponsor not found' 
          },
          { status: 404 }
        )
      }
      
      const query = `
        UPDATE sponsor 
        SET sponsorname = $2, payment = $3
        WHERE sponsorid = $1
        RETURNING *
      `
      
      const values = [
        sponsorid, 
        sponsorname.trim(), 
        payment ? parseFloat(payment) : null
      ]
      
      const result = await client.query(query, values)
      
      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'Sponsor updated successfully'
      })
      
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update sponsor. Please check your input and try again.' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sponsorid = parseInt(params.id)
    
    if (isNaN(sponsorid)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid sponsor ID' 
        },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    
    try {
      // Check if sponsor exists
      const checkQuery = 'SELECT sponsorid FROM sponsor WHERE sponsorid = $1'
      const checkResult = await client.query(checkQuery, [sponsorid])
      
      if (checkResult.rows.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Sponsor not found' 
          },
          { status: 404 }
        )
      }

      // Check if sponsor has related events
      const eventsCheckQuery = 'SELECT COUNT(*) as count FROM event_sponsor WHERE sponsorid = $1'
      const eventsResult = await client.query(eventsCheckQuery, [sponsorid])
      
      if (parseInt(eventsResult.rows[0].count) > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Cannot delete sponsor with existing events. Please remove from all events first.' 
          },
          { status: 400 }
        )
      }
      
      const deleteQuery = 'DELETE FROM sponsor WHERE sponsorid = $1 RETURNING *'
      const result = await client.query(deleteQuery, [sponsorid])
      
      return NextResponse.json({
        success: true,
        message: 'Sponsor deleted successfully',
        data: result.rows[0]
      })
      
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete sponsor' 
      },
      { status: 500 }
    )
  }
}