// app/api/query/route.ts
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    // Basic security: prevent potentially dangerous operations
    const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'INSERT', 'UPDATE']
    const upperQuery = query.toUpperCase()
    
    for (const keyword of dangerousKeywords) {
      if (upperQuery.includes(keyword)) {
        return NextResponse.json(
          { error: `Query contains potentially dangerous operation: ${keyword}. Only SELECT queries are allowed.` },
          { status: 403 }
        )
      }
    }

    // Execute the query
    const startTime = Date.now()
    const result = await pool.query(query)
    const executionTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      data: result.rows,
      rowCount: result.rowCount,
      executionTime: `${executionTime}ms`,
      fields: result.fields?.map(field => ({
        name: field.name,
        dataTypeID: field.dataTypeID
      }))
    })

  } catch (error: any) {
    console.error('Query execution error:', error)
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to execute query',
        code: error.code || 'UNKNOWN_ERROR'
      },
      { status: 500 }
    )
  }
}