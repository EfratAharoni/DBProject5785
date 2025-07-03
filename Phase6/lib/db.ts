// lib/db.ts
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'mydatabase',
  user: process.env.DATABASE_USER || 'avishaco',
  password: process.env.DATABASE_PASSWORD || 'ac325277457',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database')
})

pool.on('error', (error) => {
  console.error('Database connection error:', error)
})

export default pool