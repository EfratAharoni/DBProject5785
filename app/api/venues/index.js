// pages/api/venues/index.js
import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = await pool.connect();
  
  try {
    const query = `
      SELECT venid, venname, location, capacity, venudescription, rental_price, parking
      FROM venue
      ORDER BY venname ASC
    `;
    
    const result = await client.query(query);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}