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
import { ArrowLeft, Play, FileText, Database, Clock, Download } from "lucide-react"
import Link from "next/link"

interface QueryResult {
  id: number
  query: string
  status: "running" | "completed" | "failed"
  executionTime: string
  rowCount?: number
  data?: any[]
  error?: string
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
    AVG(v.capacity - e.available_seats) as avg_attendance,
    ROUND((AVG(v.capacity - e.available_seats)::NUMERIC / v.capacity) * 100, 2) as avg_occupancy_rate,
    SUM(COALESCE(ticket_revenue.revenue, 0)) as total_revenue
FROM venue v
LEFT JOIN events e ON v.venid = e.venid
LEFT JOIN (
    SELECT eventid, SUM(price) as revenue
    FROM ticket
    GROUP BY eventid
) ticket_revenue ON e.eventid = ticket_revenue.eventid
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
    AVG(r.rating) as avg_rating,
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
  ]

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated")
    if (!isAuthenticated) {
      router.push("/")
      return
    }
  }, [router])

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

    try {
      const newResult: QueryResult = {
        id: queryResults.length + 1,
        query: customQuery,
        status: "running",
        executionTime: new Date().toLocaleString(),
      }

      setQueryResults((prev) => [newResult, ...prev])

      // Simulate query execution
      setTimeout(() => {
        // Generate mock data based on query type
        let mockData: any[] = []
        let rowCount = 0

        if (customQuery.toLowerCase().includes("events")) {
          mockData = [
            {
              eventid: 1,
              eventtype: "Concert",
              eventdate: "2024-07-15",
              venname: "Madison Square Garden",
              tickets_sold: 15000,
              total_revenue: 750000,
            },
            {
              eventid: 2,
              eventtype: "Sports",
              eventdate: "2024-08-20",
              venname: "Hollywood Bowl",
              tickets_sold: 12000,
              total_revenue: 600000,
            },
            {
              eventid: 3,
              eventtype: "Theater",
              eventdate: "2024-09-10",
              venname: "Red Rocks Amphitheatre",
              tickets_sold: 8000,
              total_revenue: 400000,
            },
          ]
          rowCount = 3
        } else if (customQuery.toLowerCase().includes("customers")) {
          mockData = [
            {
              cusid: 1,
              cusname: "John Smith",
              cusemail: "john@email.com",
              tickets_purchased: 5,
              reviews_written: 3,
              avg_rating_given: 4.2,
              total_spent: 250,
            },
            {
              cusid: 2,
              cusname: "Sarah Johnson",
              cusemail: "sarah@email.com",
              tickets_purchased: 8,
              reviews_written: 5,
              avg_rating_given: 4.5,
              total_spent: 400,
            },
            {
              cusid: 3,
              cusname: "Michael Brown",
              cusemail: "michael@email.com",
              tickets_purchased: 3,
              reviews_written: 2,
              avg_rating_given: 3.8,
              total_spent: 150,
            },
          ]
          rowCount = 3
        } else {
          mockData = [
            { column1: "Sample Data", column2: "Value 1", column3: 123 },
            { column1: "Sample Data", column2: "Value 2", column3: 456 },
          ]
          rowCount = 2
        }

        const completedResult: QueryResult = {
          ...newResult,
          status: "completed",
          rowCount,
          data: mockData,
        }

        setQueryResults((prev) => prev.map((result) => (result.id === newResult.id ? completedResult : result)))

        setSuccess(`Query executed successfully! ${rowCount} rows returned.`)
        setIsExecuting(false)
      }, 2000)
    } catch (err) {
      setError("Failed to execute query. Please check your SQL syntax.")
      setIsExecuting(false)
    }
  }

  const exportResults = (result: QueryResult) => {
    if (!result.data) return

    const csv = [Object.keys(result.data[0]).join(","), ...result.data.map((row) => Object.values(row).join(","))].join(
      "\n",
    )

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `query_result_${result.id}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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
                <CardDescription>Write and execute SQL queries against your database</CardDescription>
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
                <div className="space-y-3">
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
                          {result.status === "completed" && result.data && (
                            <Button variant="outline" size="sm" onClick={() => exportResults(result)}>
                              <Download className="w-3 h-3 mr-1" />
                              Export
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{result.executionTime}</p>
                        <p className="text-xs font-mono bg-gray-50 p-2 rounded">{result.query.substring(0, 100)}...</p>
                        {result.rowCount !== undefined && (
                          <p className="text-xs text-green-600 mt-1">{result.rowCount} rows returned</p>
                        )}
                        {result.error && <p className="text-xs text-red-600 mt-1">{result.error}</p>}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Query Results */}
        {queryResults.length > 0 && queryResults[0].data && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Query Results</CardTitle>
              <CardDescription>Results from the most recent query execution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(queryResults[0].data[0]).map((column) => (
                        <TableHead key={column}>{column}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queryResults[0].data.map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, cellIndex) => (
                          <TableCell key={cellIndex}>
                            {typeof value === "number" ? value.toLocaleString() : String(value)}
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
