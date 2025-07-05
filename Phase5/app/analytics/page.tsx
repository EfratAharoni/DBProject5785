"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, TrendingDown, Users, Calendar, DollarSign, Star } from "lucide-react"
import Link from "next/link"

interface AnalyticsData {
  totalRevenue: number
  revenueGrowth: number
  totalCustomers: number
  customerGrowth: number
  totalEvents: number
  eventGrowth: number
  avgRating: number
  ratingChange: number
  monthlyRevenue: Array<{ month: string; revenue: number; events: number }>
  topEvents: Array<{ name: string; revenue: number; attendance: number }>
  customerSegments: Array<{ segment: string; count: number; percentage: number }>
  venuePerformance: Array<{ venue: string; occupancy: number; revenue: number }>
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState("last-30-days")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated")
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    loadAnalytics()
  }, [router, timeRange])

  const loadAnalytics = () => {
    setIsLoading(true)

    // Simulate loading analytics data
    setTimeout(() => {
      const mockAnalytics: AnalyticsData = {
        totalRevenue: 2450000,
        revenueGrowth: 12.5,
        totalCustomers: 1247,
        customerGrowth: 8.3,
        totalEvents: 89,
        eventGrowth: -2.1,
        avgRating: 4.2,
        ratingChange: 0.3,
        monthlyRevenue: [
          { month: "Jan", revenue: 380000, events: 15 },
          { month: "Feb", revenue: 420000, events: 18 },
          { month: "Mar", revenue: 450000, events: 20 },
          { month: "Apr", revenue: 380000, events: 16 },
          { month: "May", revenue: 520000, events: 22 },
          { month: "Jun", revenue: 480000, events: 19 },
        ],
        topEvents: [
          { name: "Summer Music Festival", revenue: 750000, attendance: 25000 },
          { name: "Championship Finals", revenue: 680000, attendance: 22000 },
          { name: "Broadway Night", revenue: 420000, attendance: 8500 },
          { name: "Jazz Concert Series", revenue: 380000, attendance: 12000 },
          { name: "Comedy Special", revenue: 220000, attendance: 5500 },
        ],
        customerSegments: [
          { segment: "VIP Members", count: 125, percentage: 10 },
          { segment: "Regular Customers", count: 623, percentage: 50 },
          { segment: "Occasional Visitors", count: 374, percentage: 30 },
          { segment: "New Customers", count: 125, percentage: 10 },
        ],
        venuePerformance: [
          { venue: "Madison Square Garden", occupancy: 85, revenue: 950000 },
          { venue: "Hollywood Bowl", occupancy: 78, revenue: 720000 },
          { venue: "Red Rocks Amphitheatre", occupancy: 92, revenue: 580000 },
          { venue: "Chicago Theatre", occupancy: 65, revenue: 200000 },
        ],
      }
      setAnalytics(mockAnalytics)
      setIsLoading(false)
    }, 1000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    )
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) return null

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
              <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
              <div className={`flex items-center text-xs ${getGrowthColor(analytics.revenueGrowth)}`}>
                {getGrowthIcon(analytics.revenueGrowth)}
                <span className="ml-1">
                  {analytics.revenueGrowth >= 0 ? "+" : ""}
                  {analytics.revenueGrowth}% from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalCustomers.toLocaleString()}</div>
              <div className={`flex items-center text-xs ${getGrowthColor(analytics.customerGrowth)}`}>
                {getGrowthIcon(analytics.customerGrowth)}
                <span className="ml-1">
                  {analytics.customerGrowth >= 0 ? "+" : ""}
                  {analytics.customerGrowth}% from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalEvents}</div>
              <div className={`flex items-center text-xs ${getGrowthColor(analytics.eventGrowth)}`}>
                {getGrowthIcon(analytics.eventGrowth)}
                <span className="ml-1">
                  {analytics.eventGrowth >= 0 ? "+" : ""}
                  {analytics.eventGrowth}% from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.avgRating}</div>
              <div className={`flex items-center text-xs ${getGrowthColor(analytics.ratingChange)}`}>
                {getGrowthIcon(analytics.ratingChange)}
                <span className="ml-1">
                  {analytics.ratingChange >= 0 ? "+" : ""}
                  {analytics.ratingChange} from last period
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
              <CardDescription>Revenue and event count over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyRevenue.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 text-sm font-medium">{item.month}</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{formatCurrency(item.revenue)}</div>
                        <div className="text-xs text-gray-500">{item.events} events</div>
                      </div>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(item.revenue / Math.max(...analytics.monthlyRevenue.map((m) => m.revenue))) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Events */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Events</CardTitle>
              <CardDescription>Events ranked by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <div className="text-sm font-medium">{event.name}</div>
                        <div className="text-xs text-gray-500">{event.attendance.toLocaleString()} attendees</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">{formatCurrency(event.revenue)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Segments and Venue Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Segments */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
              <CardDescription>Customer distribution by segment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.customerSegments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium">{segment.segment}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm">{segment.count} customers</div>
                      <Badge variant="secondary">{segment.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Venue Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Venue Performance</CardTitle>
              <CardDescription>Occupancy rates and revenue by venue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.venuePerformance.map((venue, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{venue.venue}</div>
                      <div className="text-sm">{formatCurrency(venue.revenue)}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${venue.occupancy}%` }}></div>
                      </div>
                      <div className="text-xs text-gray-500">{venue.occupancy}% occupancy</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
