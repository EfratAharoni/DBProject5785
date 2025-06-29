// app/api/customers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { cusname, cuscontactinfo, cusemail } = await request.json()
    const cusid = parseInt(params.id)
    
    if (!cusname) {
      return new NextResponse("Customer name is required", { status: 400 })
    }

    if (isNaN(cusid)) {
      return new NextResponse("Invalid customer ID", { status: 400 })
    }

    const result = await pool.query(
      "UPDATE customers SET cusname = $1, cuscontactinfo = $2, cusemail = $3 WHERE cusid = $4 RETURNING *",
      [cusname, cuscontactinfo, cusemail, cusid]
    )
    
    if (result.rows.length === 0) {
      return new NextResponse("Customer not found", { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Database error:", error)
    return new NextResponse("Failed to update customer", { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cusid = parseInt(params.id)
    
    if (isNaN(cusid)) {
      return new NextResponse("Invalid customer ID", { status: 400 })
    }
    
    const result = await pool.query(
      "DELETE FROM customers WHERE cusid = $1 RETURNING *",
      [cusid]
    )
    
    if (result.rows.length === 0) {
      return new NextResponse("Customer not found", { status: 404 })
    }
    
    return NextResponse.json({ message: "Customer deleted successfully" })
  } catch (error) {
    console.error("Database error:", error)
    return new NextResponse("Failed to delete customer", { status: 500 })
  }
}