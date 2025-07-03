// app/api/events/route.ts
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
        e.eventid,
        e.eventtype,
        e.eventdate,
        e.available_seats,
        e.additional_fees,
        e.cusid,
        e.venid,
        v.venname as venue_name,
        c.cusname as customer_name
      FROM events e
      LEFT JOIN venue v ON e.venid = v.venid
      LEFT JOIN customers c ON e.cusid = c.cusid
      ORDER BY e.eventdate ASC
    `
    
    const result = await client.query(query)
    client.release()
    
    return NextResponse.json(result.rows)
    
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventtype, eventdate, available_seats, additional_fees, cusid, venid } = body

    // Validation
    if (!eventtype || !eventdate || !available_seats || !cusid || !venid) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      // Get next event ID
      const idResult = await client.query('SELECT COALESCE(MAX(eventid), 0) + 1 as next_id FROM events')
      const nextId = idResult.rows[0].next_id
      
      // Insert new event
      const insertQuery = `
        INSERT INTO events (eventid, eventtype, eventdate, available_seats, additional_fees, cusid, venid)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `
      
      const values = [nextId, eventtype, eventdate, parseInt(available_seats), additional_fees, parseInt(cusid), parseInt(venid)]
      await client.query(insertQuery, values)
      
      // Get the created event with venue and customer names
      const selectQuery = `
        SELECT 
          e.eventid,
          e.eventtype,
          e.eventdate,
          e.available_seats,
          e.additional_fees,
          e.cusid,
          e.venid,
          v.venname as venue_name,
          c.cusname as customer_name
        FROM events e
        LEFT JOIN venue v ON e.venid = v.venid
        LEFT JOIN customers c ON e.cusid = c.cusid
        WHERE e.eventid = $1
      `
      
      const eventResult = await client.query(selectQuery, [nextId])
      
      await client.query('COMMIT')
      return NextResponse.json(eventResult.rows[0], { status: 201 })
      
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}