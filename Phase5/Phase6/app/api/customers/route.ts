// app/api/customers/route.ts
import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM customers ORDER BY cusid ASC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Database error:", error)
    return new NextResponse("Failed to fetch customers", { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { cusname, cuscontactinfo, cusemail } = await request.json()
    
    if (!cusname) {
      return new NextResponse("Customer name is required", { status: 400 })
    }

    // Get the next available cusid
    const maxIdResult = await pool.query("SELECT COALESCE(MAX(cusid), 0) + 1 as next_id FROM customers")
    const nextId = maxIdResult.rows[0].next_id

    const result = await pool.query(
      "INSERT INTO customers (cusid, cusname, cuscontactinfo, cusemail) VALUES ($1, $2, $3, $4) RETURNING *",
      [nextId, cusname, cuscontactinfo, cusemail]
    )
    
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Database error:", error)
    return new NextResponse("Failed to create customer", { status: 500 })
  }
}