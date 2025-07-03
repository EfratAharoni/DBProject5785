// app/api/venues/[id]/route.ts
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
    const venid = parseInt(params.id)
    
    if (isNaN(venid)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid venue ID' 
        },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    
    try {
      const query = 'SELECT * FROM venue WHERE venid = $1'
      const result = await client.query(query, [venid])
      
      if (result.rows.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Venue not found' 
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
        error: 'Failed to fetch venue' 
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
    const venid = parseInt(params.id)
    
    if (isNaN(venid)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid venue ID' 
        },
        { status: 400 }
      )
    }

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

    if (parseInt(capacity) <= 0) {
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
      // Check if venue exists
      const checkQuery = 'SELECT venid FROM venue WHERE venid = $1'
      const checkResult = await client.query(checkQuery, [venid])
      
      if (checkResult.rows.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Venue not found' 
          },
          { status: 404 }
        )
      }
      
      const query = `
        UPDATE venue 
        SET venname = $2, location = $3, capacity = $4, venudescription = $5, rental_price = $6, parking = $7
        WHERE venid = $1
        RETURNING *
      `
      
      const values = [
        venid, 
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
        data: result.rows[0],
        message: 'Venue updated successfully'
      })
      
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update venue. Please check your input and try again.' 
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
    const venid = parseInt(params.id)
    
    if (isNaN(venid)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid venue ID' 
        },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    
    try {
      // Check if venue exists
      const checkQuery = 'SELECT venid FROM venue WHERE venid = $1'
      const checkResult = await client.query(checkQuery, [venid])
      
      if (checkResult.rows.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Venue not found' 
          },
          { status: 404 }
        )
      }

      // Check if venue has related events
      const eventsCheckQuery = 'SELECT COUNT(*) as count FROM events WHERE venid = $1'
      const eventsResult = await client.query(eventsCheckQuery, [venid])
      
      if (parseInt(eventsResult.rows[0].count) > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Cannot delete venue with existing events. Please remove all events first.' 
          },
          { status: 400 }
        )
      }
      
      // Check if venue has related owners
      const ownersCheckQuery = 'SELECT COUNT(*) as count FROM owners WHERE venid = $1'
      const ownersResult = await client.query(ownersCheckQuery, [venid])
      
      if (parseInt(ownersResult.rows[0].count) > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Cannot delete venue with existing owners. Please remove all owners first.' 
          },
          { status: 400 }
        )
      }
      
      // Check if venue has related facilities
      const facilitiesCheckQuery = 'SELECT COUNT(*) as count FROM facilities WHERE venid = $1'
      const facilitiesResult = await client.query(facilitiesCheckQuery, [venid])
      
      if (parseInt(facilitiesResult.rows[0].count) > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Cannot delete venue with existing facilities. Please remove all facilities first.' 
          },
          { status: 400 }
        )
      }
      
      const deleteQuery = 'DELETE FROM venue WHERE venid = $1 RETURNING *'
      const result = await client.query(deleteQuery, [venid])
      
      return NextResponse.json({
        success: true,
        message: 'Venue deleted successfully',
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
        error: 'Failed to delete venue' 
      },
      { status: 500 }
    )
  }
}