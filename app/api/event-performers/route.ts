// app/api/event-performers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// GET - Fetch all event performers with details
export async function GET() {
  try {
    const query = `
      SELECT 
        ep.eventid,
        ep.performerid,
        e.eventtype as event_type,
        e.eventdate as event_date,
        p.performername as performer_name,
        p.perfcontactinfo as performer_contact
      FROM event_performer ep
      JOIN events e ON ep.eventid = e.eventid
      JOIN performer p ON ep.performerid = p.performerid
      ORDER BY e.eventdate DESC, e.eventid, p.performername
    `
    
    const result = await pool.query(query)
    
    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching event performers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event performers' },
      { status: 500 }
    )
  }
}

// POST - Create new event performer assignment
export async function POST(request: NextRequest) {
  try {
    const { eventid, performerid } = await request.json()
    
    if (!eventid || !performerid) {
      return NextResponse.json(
        { success: false, error: 'Event ID and Performer ID are required' },
        { status: 400 }
      )
    }

    // Check if assignment already exists
    const existingQuery = `
      SELECT * FROM event_performer 
      WHERE eventid = $1 AND performerid = $2
    `
    const existingResult = await pool.query(existingQuery, [eventid, performerid])
    
    if (existingResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'This performer is already assigned to this event' },
        { status: 409 }
      )
    }

    // Verify event exists
    const eventQuery = 'SELECT * FROM events WHERE eventid = $1'
    const eventResult = await pool.query(eventQuery, [eventid])
    
    if (eventResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    // Verify performer exists
    const performerQuery = 'SELECT * FROM performer WHERE performerid = $1'
    const performerResult = await pool.query(performerQuery, [performerid])
    
    if (performerResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Performer not found' },
        { status: 404 }
      )
    }

    // Insert new assignment
    const insertQuery = `
      INSERT INTO event_performer (eventid, performerid)
      VALUES ($1, $2)
      RETURNING *
    `
    
    await pool.query(insertQuery, [eventid, performerid])
    
    // Return the complete assignment data
    const detailsQuery = `
      SELECT 
        ep.eventid,
        ep.performerid,
        e.eventtype as event_type,
        e.eventdate as event_date,
        p.performername as performer_name,
        p.perfcontactinfo as performer_contact
      FROM event_performer ep
      JOIN events e ON ep.eventid = e.eventid
      JOIN performer p ON ep.performerid = p.performerid
      WHERE ep.eventid = $1 AND ep.performerid = $2
    `
    
    const detailsResult = await pool.query(detailsQuery, [eventid, performerid])
    
    return NextResponse.json({
      success: true,
      message: 'Performer assigned to event successfully',
      data: detailsResult.rows[0]
    })
    
  } catch (error) {
    console.error('Error creating event performer assignment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to assign performer to event' },
      { status: 500 }
    )
  }
}

// DELETE - Remove event performer assignment
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const eventid = url.searchParams.get('eventid')
    const performerid = url.searchParams.get('performerid')
    
    if (!eventid || !performerid) {
      return NextResponse.json(
        { success: false, error: 'Event ID and Performer ID are required' },
        { status: 400 }
      )
    }

    // Check if assignment exists
    const existingQuery = `
      SELECT * FROM event_performer 
      WHERE eventid = $1 AND performerid = $2
    `
    const existingResult = await pool.query(existingQuery, [eventid, performerid])
    
    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Assignment not found' },
        { status: 404 }
      )
    }

    // Delete assignment
    const deleteQuery = `
      DELETE FROM event_performer 
      WHERE eventid = $1 AND performerid = $2
    `
    
    await pool.query(deleteQuery, [eventid, performerid])
    
    return NextResponse.json({
      success: true,
      message: 'Performer removed from event successfully'
    })
    
  } catch (error) {
    console.error('Error deleting event performer assignment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove performer from event' },
      { status: 500 }
    )
  }
}