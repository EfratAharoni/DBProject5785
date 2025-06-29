"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, FileText, Database, Clock, Download, AlertCircle } from "lucide-react"
import Link from "next/link"

interface QueryResult {
  id: number
  query: string
  status: "running" | "completed" | "failed"
  executionTime: string
  rowCount?: number
  data?: any[]
  error?: string
  errorCode?: string
}

interface QueryResponse {
  success: boolean
  data?: any[]
  rowCount?: number
  executionTime?: string
  error?: string
  code?: string
  fields?: Array<{ name: string; dataTypeID: number }>
}

export default function QueriesPage() {
  const router = useRouter()
  const [selectedQuery, setSelectedQuery] = useState("")
  const [customQuery, setCustomQuery] = useState("")
  const [queryResults, setQueryResults] = useState<QueryResult[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const predefinedQueries = [
    {
      name: "Top Events by Ticket Sales",
      description: "Shows events with highest ticket sales and revenue",
      query: `SELECT 
    e.eventid,
    e.eventtype,
    e.eventdate,
    v.venname,
    COUNT(t.ticketid) as tickets_sold,
    SUM(t.price) as total_revenue
FROM events e
JOIN venue v ON e.venid = v.venid
LEFT JOIN ticket t ON e.eventid = t.eventid
GROUP BY e.eventid, e.eventtype, e.eventdate, v.venname
ORDER BY total_revenue DESC NULLS LAST
LIMIT 10;`,
    },
    {
      name: "Customer Activity Report",
      description: "Customer purchase history and review activity",
      query: `SELECT 
    c.cusid,
    c.cusname,
    c.cusemail,
    COUNT(DISTINCT t.ticketid) as tickets_purchased,
    COUNT(DISTINCT r.revid) as reviews_written,
    AVG(r.rating) as avg_rating_given,
    SUM(t.price) as total_spent
FROM customers c
LEFT JOIN ticket t ON c.cusid = t.cusid
LEFT JOIN reviews r ON c.cusid = r.cusid
GROUP BY c.cusid, c.cusname, c.cusemail
HAVING COUNT(DISTINCT t.ticketid) > 0
ORDER BY total_spent DESC;`,
    },
    {
      name: "Venue Performance Analysis",
      description: "Venue utilization and revenue analysis",
      query: `SELECT 
    v.venid,
    v.venname,
    v.capacity,
    COUNT(e.eventid) as total_events,
    COALESCE(SUM(ticket_counts.tickets_sold), 0) as total_tickets_sold,
    COALESCE(SUM(ticket_counts.total_revenue), 0) as total_revenue,
    CASE 
        WHEN v.capacity > 0 THEN ROUND((COALESCE(AVG(ticket_counts.tickets_sold), 0) / v.capacity) * 100, 2)
        ELSE 0 
    END as avg_occupancy_rate
FROM venue v
LEFT JOIN events e ON v.venid = e.venid
LEFT JOIN (
    SELECT 
        eventid, 
        COUNT(ticketid) as tickets_sold, 
        SUM(price) as total_revenue
    FROM ticket
    GROUP BY eventid
) ticket_counts ON e.eventid = ticket_counts.eventid
GROUP BY v.venid, v.venname, v.capacity
ORDER BY total_revenue DESC;`,
    },
    {
      name: "Event Reviews Summary",
      description: "Review statistics and ratings by event",
      query: `SELECT 
    e.eventid,
    e.eventtype,
    e.eventdate,
    v.venname,
    COUNT(r.revid) as review_count,
    ROUND(AVG(r.rating), 2) as avg_rating,
    MIN(r.rating) as min_rating,
    MAX(r.rating) as max_rating,
    COUNT(CASE WHEN r.rating >= 4 THEN 1 END) as positive_reviews,
    COUNT(CASE WHEN r.rating <= 2 THEN 1 END) as negative_reviews
FROM events e
JOIN venue v ON e.venid = v.venid
LEFT JOIN reviews r ON e.eventid = r.eventid
GROUP BY e.eventid, e.eventtype, e.eventdate, v.venname
HAVING COUNT(r.revid) > 0
ORDER BY avg_rating DESC, review_count DESC;`,
    },
    {
      name: "Database Tables Overview",
      description: "Show all tables in the database",
      query: `SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;`,
    },
    {
      name: "Venue List",
      description: "List all venues with their details",
      query: `SELECT 
    venid,
    venname,
    location,
    capacity,
    rental_price,
    parking
FROM venue
ORDER BY venname;`,
    },
    {
      name: "Recent Tickets Sales",
      description: "Show recent ticket sales in the last 30 days",
      query: `SELECT 
    t.ticketid,
    t.price,
    t.saledate,
    e.eventtype,
    e.eventdate,
    v.venname,
    c.cusname
FROM ticket t
JOIN events e ON t.eventid = e.eventid
JOIN venue v ON e.venid = v.venid
JOIN customers c ON t.cusid = c.cusid
WHERE t.saledate >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY t.saledate DESC
LIMIT 20;`,
    }
  ]

  useEffect(() => {
    // Remove localStorage check for demo purposes
    // In production, implement proper authentication
  }, [])

  const handleQuerySelect = (queryName: string) => {
    const query = predefinedQueries.find((q) => q.name === queryName)
    if (query) {
      setSelectedQuery(queryName)
      setCustomQuery(query.query)
    }
  }

  const executeQuery = async () => {
    if (!customQuery.trim()) {
      setError("Please enter a SQL query to execute.")
      return
    }

    setIsExecuting(true)
    setError("")
    setSuccess("")

    const newResult: QueryResult = {
      id: Date.now(), // Use timestamp as unique ID
      query: customQuery,
      status: "running",
      executionTime: new Date().toLocaleString(),
    }

    setQueryResults((prev) => [newResult, ...prev])

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: customQuery }),
      })

      const result: QueryResponse = await response.json()

      if (result.success && result.data) {
        const completedResult: QueryResult = {
          ...newResult,
          status: "completed",
          rowCount: result.rowCount || 0,
          data: result.data,
          executionTime: result.executionTime || "N/A",
        }

        setQueryResults((prev) => 
          prev.map((r) => (r.id === newResult.id ? completedResult : r))
        )

        setSuccess(`Query executed successfully! ${result.rowCount || 0} rows returned in ${result.executionTime || "N/A"}.`)
      } else {
        throw new Error(result.error || 'Unknown error occurred')
      }
    } catch (err: any) {
      const failedResult: QueryResult = {
        ...newResult,
        status: "failed",
        error: err.message || "Failed to execute query",
        errorCode: err.code || "UNKNOWN_ERROR",
      }

      setQueryResults((prev) => 
        prev.map((r) => (r.id === newResult.id ? failedResult : r))
      )

      setError(err.message || "Failed to execute query. Please check your SQL syntax.")
    } finally {
      setIsExecuting(false)
    }
  }

  const exportResults = (result: QueryResult) => {
    if (!result.data || result.data.length === 0) return

    const headers = Object.keys(result.data[0])
    const csvContent = [
      headers.join(","),
      ...result.data.map((row) => 
        headers.map(header => {
          const value = row[header]
          // Handle null/undefined values and escape commas
          if (value === null || value === undefined) return ""
          const stringValue = String(value)
          return stringValue.includes(",") ? `"${stringValue}"` : stringValue
        }).join(",")
      )
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `query_result_${result.id}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">SQL Query Executor</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Query Editor */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Query Editor
                </CardTitle>
                <CardDescription>
                  Write and execute SQL queries against your PostgreSQL database
                  <br />
                  <span className="text-xs text-orange-600">
                    ⚠️ Only SELECT queries are allowed for security reasons
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Predefined Queries</label>
                  <Select value={selectedQuery} onValueChange={handleQuerySelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a predefined query or write your own" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedQueries.map((query) => (
                        <SelectItem key={query.name} value={query.name}>
                          {query.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedQuery && (
                    <p className="text-xs text-gray-500 mt-1">
                      {predefinedQueries.find((q) => q.name === selectedQuery)?.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">SQL Query</label>
                  <Textarea
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder="Enter your SQL query here..."
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>

                <Button onClick={executeQuery} disabled={isExecuting || !customQuery.trim()} className="w-full">
                  {isExecuting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Executing Query...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Execute Query
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Query History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Query History</CardTitle>
                <CardDescription>Recent query executions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {queryResults.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No queries executed yet</p>
                    </div>
                  ) : (
                    queryResults.map((result) => (
                      <div key={result.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant={
                              result.status === "completed"
                                ? "default"
                                : result.status === "failed"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {result.status}
                          </Badge>
                          {result.status === "completed" && result.data && result.data.length > 0 && (
                            <Button variant="outline" size="sm" onClick={() => exportResults(result)}>
                              <Download className="w-3 h-3 mr-1" />
                              Export
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          {typeof result.executionTime === 'string' && result.executionTime.includes('ms') 
                            ? `Executed in ${result.executionTime}` 
                            : result.executionTime
                          }
                        </p>
                        <p className="text-xs font-mono bg-gray-50 p-2 rounded">
                          {result.query.length > 100 ? `${result.query.substring(0, 100)}...` : result.query}
                        </p>
                        {result.rowCount !== undefined && (
                          <p className="text-xs text-green-600 mt-1">{result.rowCount} rows returned</p>
                        )}
                        {result.error && (
                          <p className="text-xs text-red-600 mt-1">
                            {result.errorCode && `[${result.errorCode}] `}{result.error}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Query Results */}
        {queryResults.length > 0 && queryResults[0].data && queryResults[0].data.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Query Results</CardTitle>
              <CardDescription>
                Results from the most recent query execution ({queryResults[0].rowCount} rows)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(queryResults[0].data[0]).map((column) => (
                        <TableHead key={column} className="font-semibold">{column}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queryResults[0].data.map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, cellIndex) => (
                          <TableCell key={cellIndex} className="max-w-xs truncate">
                            {value === null || value === undefined ? (
                              <span className="text-gray-400 italic">null</span>
                            ) : typeof value === "number" ? (
                              value.toLocaleString()
                            ) : (
                              String(value)
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}