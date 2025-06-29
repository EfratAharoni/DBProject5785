"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BarChart3, Download, FileText, Calendar, Users, MapPin, Star } from "lucide-react"
import Link from "next/link"

interface ReportData {
  id: number
  name: string
  type: string
  data: any[]
  generatedAt: string
}

export default function ReportsPage() {
  const router = useRouter()
  const [reports, setReports] = useState<ReportData[]>([])
  const [selectedReport, setSelectedReport] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const availableReports = [
    {
      id: "event-summary",
      name: "Event Summary Report",
      description: "Overview of all events with attendance and revenue",
      type: "Events",
    },
    {
      id: "customer-analysis",
      name: "Customer Analysis Report",
      description: "Customer demographics and purchase behavior",
      type: "Customers",
    },
    {
      id: "venue-performance",
      name: "Venue Performance Report",
      description: "Venue utilization and revenue analysis",
      type: "Venues",
    },
    {
      id: "financial-summary",
      name: "Financial Summary Report",
      description: "Revenue and financial performance overview",
      type: "Financial",
    },
    {
      id: "review-analysis",
      name: "Review Analysis Report",
      description: "Customer satisfaction and review trends",
      type: "Reviews",
    },
  ]

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated")
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    // Load existing reports
    setTimeout(() => {
      const mockReports: ReportData[] = [
        {
          id: 1,
          name: "Event Summary Report",
          type: "Events",
          data: [
            { event_name: "Summer Concert", event_type: "Concert", attendance: 15000, revenue: 750000, rating: 4.5 },
            {
              event_name: "Sports Championship",
              event_type: "Sports",
              attendance: 18000,
              revenue: 900000,
              rating: 4.2,
            },
            { event_name: "Theater Night", event_type: "Theater", attendance: 2500, revenue: 125000, rating: 4.8 },
          ],
          generatedAt: "2024-01-15 10:30:00",
        },
        {
          id: 2,
          name: "Customer Analysis Report",
          type: "Customers",
          data: [
            { age_group: "18-25", total_customers: 450, avg_spending: 125, total_tickets: 1200 },
            { age_group: "26-35", total_customers: 680, avg_spending: 185, total_tickets: 2100 },
            { age_group: "36-50", total_customers: 520, avg_spending: 220, total_tickets: 1800 },
            { age_group: "50+", total_customers: 350, avg_spending: 195, total_tickets: 980 },
          ],
          generatedAt: "2024-01-14 14:20:00",
        },
      ]
      setReports(mockReports)
      setIsLoading(false)
    }, 1000)
  }, [router])

  const generateReport = async () => {
    if (!selectedReport) {
      setError("Please select a report type to generate.")
      return
    }

    setIsGenerating(true)
    setError("")
    setSuccess("")

    try {
      const reportConfig = availableReports.find((r) => r.id === selectedReport)
      if (!reportConfig) return

      // Simulate report generation
      setTimeout(() => {
        let mockData: any[] = []

        switch (selectedReport) {
          case "event-summary":
            mockData = [
              { event_name: "Jazz Festival", event_type: "Concert", attendance: 12000, revenue: 600000, rating: 4.3 },
              { event_name: "Basketball Game", event_type: "Sports", attendance: 16000, revenue: 800000, rating: 4.1 },
              { event_name: "Comedy Show", event_type: "Theater", attendance: 1800, revenue: 90000, rating: 4.6 },
            ]
            break
          case "customer-analysis":
            mockData = [
              { segment: "VIP Customers", count: 125, avg_spending: 450, retention_rate: "95%" },
              { segment: "Regular Customers", count: 850, avg_spending: 180, retention_rate: "78%" },
              { segment: "New Customers", count: 320, avg_spending: 95, retention_rate: "45%" },
            ]
            break
          case "venue-performance":
            mockData = [
              { venue_name: "Madison Square Garden", events_hosted: 45, avg_occupancy: "85%", total_revenue: 2250000 },
              { venue_name: "Hollywood Bowl", events_hosted: 38, avg_occupancy: "78%", total_revenue: 1900000 },
              { venue_name: "Red Rocks", events_hosted: 32, avg_occupancy: "92%", total_revenue: 1600000 },
            ]
            break
          case "financial-summary":
            mockData = [
              { month: "January", ticket_sales: 450000, expenses: 180000, profit: 270000, margin: "60%" },
              { month: "February", ticket_sales: 520000, expenses: 195000, profit: 325000, margin: "62.5%" },
              { month: "March", ticket_sales: 680000, expenses: 245000, profit: 435000, margin: "64%" },
            ]
            break
          case "review-analysis":
            mockData = [
              { rating: "5 Stars", count: 450, percentage: "45%", category: "Excellent" },
              { rating: "4 Stars", count: 320, percentage: "32%", category: "Good" },
              { rating: "3 Stars", count: 150, percentage: "15%", category: "Average" },
              { rating: "2 Stars", count: 55, percentage: "5.5%", category: "Poor" },
              { rating: "1 Star", count: 25, percentage: "2.5%", category: "Very Poor" },
            ]
            break
        }

        const newReport: ReportData = {
          id: reports.length + 1,
          name: reportConfig.name,
          type: reportConfig.type,
          data: mockData,
          generatedAt: new Date().toLocaleString(),
        }

        setReports((prev) => [newReport, ...prev])
        setSuccess(`${reportConfig.name} generated successfully!`)
        setIsGenerating(false)
      }, 2000)
    } catch (err) {
      setError("Failed to generate report. Please try again.")
      setIsGenerating(false)
    }
  }

  const exportReport = (report: ReportData) => {
    if (!report.data || report.data.length === 0) return

    const headers = Object.keys(report.data[0])
    const csv = [
      headers.join(","),
      ...report.data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${report.name.replace(/\s+/g, "_")}_${report.id}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getReportIcon = (type: string) => {
    switch (type) {
      case "Events":
        return <Calendar className="w-4 h-4" />
      case "Customers":
        return <Users className="w-4 h-4" />
      case "Venues":
        return <MapPin className="w-4 h-4" />
      case "Reviews":
        return <Star className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    )
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
              <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
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
          {/* Report Generator */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Generate Report</CardTitle>
                <CardDescription>Select a report type to generate new insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Report Type</label>
                  <Select value={selectedReport} onValueChange={setSelectedReport}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableReports.map((report) => (
                        <SelectItem key={report.id} value={report.id}>
                          {report.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedReport && (
                    <p className="text-xs text-gray-500 mt-1">
                      {availableReports.find((r) => r.id === selectedReport)?.description}
                    </p>
                  )}
                </div>

                <Button onClick={generateReport} disabled={isGenerating || !selectedReport} className="w-full">
                  {isGenerating ? (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Report History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Report History</CardTitle>
                <CardDescription>Previously generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.length === 0 ? (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No reports generated yet</p>
                    </div>
                  ) : (
                    reports.map((report) => (
                      <div key={report.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getReportIcon(report.type)}
                            <span className="font-medium">{report.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{report.type}</Badge>
                            <Button variant="outline" size="sm" onClick={() => exportReport(report)}>
                              <Download className="w-3 h-3 mr-1" />
                              Export
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Generated: {report.generatedAt}</p>
                        <p className="text-sm text-gray-600 mb-3">{report.data.length} records</p>

                        {/* Preview of report data */}
                        <div className="border rounded overflow-auto max-h-48">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {Object.keys(report.data[0] || {}).map((column) => (
                                  <TableHead key={column} className="text-xs">
                                    {column.replace(/_/g, " ").toUpperCase()}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {report.data.slice(0, 3).map((row, index) => (
                                <TableRow key={index}>
                                  {Object.values(row).map((value, cellIndex) => (
                                    <TableCell key={cellIndex} className="text-xs">
                                      {typeof value === "number" ? value.toLocaleString() : String(value)}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        {report.data.length > 3 && (
                          <p className="text-xs text-gray-500 mt-2">
                            Showing 3 of {report.data.length} records. Export for full data.
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
      </div>
    </div>
  )
}
