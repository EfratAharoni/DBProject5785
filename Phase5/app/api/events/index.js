// pages/api/events/index.js
import pool from '../../../lib/db';

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        return await getEvents(req, res);
      case 'POST':
        return await createEvent(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getEvents(req, res) {
  const client = await pool.connect();
  
  try {
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
    `;
    
    const result = await client.query(query);
    return res.status(200).json(result.rows);
  } finally {
    client.release();
  }
}

async function createEvent(req, res) {
  const { eventtype, eventdate, available_seats, additional_fees, cusid, venid } = req.body;
  
  if (!eventtype || !eventdate || !available_seats || !cusid || !venid) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get next event ID
    const idResult = await client.query('SELECT COALESCE(MAX(eventid), 0) + 1 as next_id FROM events');
    const nextId = idResult.rows[0].next_id;
    
    // Insert new event
    const insertQuery = `
      INSERT INTO events (eventid, eventtype, eventdate, available_seats, additional_fees, cusid, venid)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [nextId, eventtype, eventdate, available_seats, additional_fees, cusid, venid];
    const result = await client.query(insertQuery, values);
    
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
    `;
    
    const eventResult = await client.query(selectQuery, [nextId]);
    
    await client.query('COMMIT');
    return res.status(201).json(eventResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}