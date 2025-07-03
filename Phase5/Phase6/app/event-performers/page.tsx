"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2, Star, Calendar, User, Search, SortAsc, SortDesc, Filter, X } from "lucide-react"
import Link from "next/link"

interface EventPerformer {
  eventid: number
  performerid: number
  event_type?: string
  event_date?: string
  performer_name?: string
  performer_contact?: string
}

interface Event {
  eventid: number
  eventtype: string
  eventdate: string
  available_seats?: number
  additional_fees?: string
  cusid?: number
  venid?: number
}

interface Performer {
  performerid: number
  performername: string
  perfcontactinfo: string
}

type SortField = 'event_date' | 'event_type' | 'performer_name' | 'eventid'
type SortDirection = 'asc' | 'desc'

export default function EventPerformersPage() {
  const router = useRouter()
  const [eventPerformers, setEventPerformers] = useState<EventPerformer[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [performers, setPerformers] = useState<Performer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    eventid: "",
    performerid: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [eventTypeFilter, setEventTypeFilter] = useState("")
  const [performerFilter, setPerformerFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [sortField, setSortField] = useState<SortField>('event_date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated")
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch all data in parallel
      const [eventPerformersResponse, eventsResponse, performersResponse] = await Promise.all([
        fetch('/api/event-performers'),
        fetch('/api/events'),
        fetch('/api/performers')
      ])

      const eventPerformersData = await eventPerformersResponse.json()
      const eventsData = await eventsResponse.json()
      const performersData = await performersResponse.json()

      if (eventPerformersData.success) {
        setEventPerformers(eventPerformersData.data)
      }
      
      if (eventsData.success) {
        setEvents(eventsData.data)
      }
      
      if (performersData.success) {
        setPerformers(performersData.data)
      }

      if (!eventPerformersData.success || !eventsData.success || !performersData.success) {
        setError("Failed to load some data. Please refresh the page.")
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError("Failed to load data. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/event-performers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventid: parseInt(formData.eventid),
          performerid: parseInt(formData.performerid)
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        setIsDialogOpen(false)
        setFormData({ eventid: "", performerid: "" })
        // Refresh the event performers list
        fetchData()
      } else {
        setError(data.error)
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      setError("Failed to assign performer. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (eventid: number, performerid: number) => {
    if (window.confirm("Are you sure you want to remove this performer from the event?")) {
      try {
        const response = await fetch(`/api/event-performers?eventid=${eventid}&performerid=${performerid}`, {
          method: 'DELETE'
        })

        const data = await response.json()

        if (data.success) {
          setSuccess(data.message)
          // Refresh the event performers list
          fetchData()
        } else {
          setError(data.error)
        }
      } catch (err) {
        console.error('Error deleting assignment:', err)
        setError("Failed to remove performer. Please try again.")
      }
    }
  }

  const openAddDialog = () => {
    setFormData({ eventid: "", performerid: "" })
    setError("")
    setSuccess("")
    setIsDialogOpen(true)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setEventTypeFilter("")
    setPerformerFilter("")
    setDateFilter("")
    setSortField('event_date')
    setSortDirection('desc')
  }

  // Get unique values for filters
  const uniqueEventTypes = useMemo(() => {
    const types = eventPerformers.map(ep => ep.event_type).filter(Boolean)
    return [...new Set(types)].sort()
  }, [eventPerformers])

  const uniquePerformers = useMemo(() => {
    const performerNames = eventPerformers.map(ep => ep.performer_name).filter(Boolean)
    return [...new Set(performerNames)].sort()
  }, [eventPerformers])

  // Filter and sort event performers
  const filteredAndSortedEventPerformers = useMemo(() => {
    let filtered = eventPerformers.filter(ep => {
      const matchesSearch = !searchTerm || 
        ep.performer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ep.event_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ep.eventid.toString().includes(searchTerm) ||
        ep.performerid.toString().includes(searchTerm)

      const matchesEventType = !eventTypeFilter || ep.event_type === eventTypeFilter
      const matchesPerformer = !performerFilter || ep.performer_name === performerFilter
      
      const matchesDate = !dateFilter || (ep.event_date && 
        new Date(ep.event_date).toISOString().split('T')[0] === dateFilter)

      return matchesSearch && matchesEventType && matchesPerformer && matchesDate
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortField) {
        case 'event_date':
          aValue = new Date(a.event_date || '')
          bValue = new Date(b.event_date || '')
          break
        case 'event_type':
          aValue = a.event_type || ''
          bValue = b.event_type || ''
          break
        case 'performer_name':
          aValue = a.performer_name || ''
          bValue = b.performer_name || ''
          break
        case 'eventid':
          aValue = a.eventid
          bValue = b.eventid
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [eventPerformers, searchTerm, eventTypeFilter, performerFilter, dateFilter, sortField, sortDirection])

  // Group filtered performers by event
  const groupedByEvent = useMemo(() => {
    return filteredAndSortedEventPerformers.reduce(
      (acc, ep) => {
        if (!acc[ep.eventid]) {
          acc[ep.eventid] = []
        }
        acc[ep.eventid].push(ep)
        return acc
      },
      {} as Record<number, EventPerformer[]>,
    )
  }, [filteredAndSortedEventPerformers])

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-1 font-medium"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? 
          <SortAsc className="w-4 h-4 ml-1" /> : 
          <SortDesc className="w-4 h-4 ml-1" />
      )}
    </Button>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Star className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading event performers...</p>
        </div>
      </div>
    )
  }

  const hasActiveFilters = searchTerm || eventTypeFilter || performerFilter || dateFilter || 
    sortField !== 'event_date' || sortDirection !== 'desc'

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
              <Star className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Event Performers</h1>
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

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search events, performers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Event Type Filter */}
              <Select value={eventTypeFilter} onValueChange={(value) => setEventTypeFilter(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Event Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Event Types</SelectItem>
                  {uniqueEventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Performer Filter */}
              <Select value={performerFilter} onValueChange={(value) => setPerformerFilter(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Performers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Performers</SelectItem>
                  {uniquePerformers.map((performer) => (
                    <SelectItem key={performer} value={performer}>
                      {performer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Filter */}
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="Filter by date"
              />

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>
                  Showing {filteredAndSortedEventPerformers.length} of {eventPerformers.length} assignments
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Event Performers</CardTitle>
                <CardDescription>Manage performer assignments to events</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Assign Performer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Performer to Event</DialogTitle>
                    <DialogDescription>Select an event and performer to create a new assignment</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Event</label>
                        <Select
                          value={formData.eventid}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, eventid: value }))}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an event" />
                          </SelectTrigger>
                          <SelectContent>
                            {events.map((event) => (
                              <SelectItem key={event.eventid} value={event.eventid.toString()}>
                                Event {event.eventid} - {event.eventtype} (
                                {new Date(event.eventdate).toLocaleDateString()})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Performer</label>
                        <Select
                          value={formData.performerid}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, performerid: value }))}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a performer" />
                          </SelectTrigger>
                          <SelectContent>
                            {performers.map((performer) => (
                              <SelectItem key={performer.performerid} value={performer.performerid.toString()}>
                                {performer.performername}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter className="mt-6">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting || !formData.eventid || !formData.performerid}
                      >
                        {isSubmitting ? "Assigning..." : "Assign Performer"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.keys(groupedByEvent).length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {hasActiveFilters ? "No assignments match your filters" : "No performer assignments found"}
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters} className="mt-2">
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                Object.entries(groupedByEvent).map(([eventId, performers]) => {
                  const eventInfo = performers[0]
                  return (
                    <Card key={eventId}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center">
                              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                              <SortButton field="eventid">Event {eventId}</SortButton>
                              {" - "}
                              <SortButton field="event_type">{eventInfo.event_type}</SortButton>
                            </CardTitle>
                            <CardDescription>
                              <SortButton field="event_date">
                                {eventInfo.event_date && new Date(eventInfo.event_date).toLocaleDateString()}
                              </SortButton>
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">
                            {performers.length} performer{performers.length !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Performer ID</TableHead>
                                <TableHead>
                                  <SortButton field="performer_name">Performer Name</SortButton>
                                </TableHead>
                                <TableHead>Contact Info</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {performers.map((ep) => (
                                <TableRow key={`${ep.eventid}-${ep.performerid}`}>
                                  <TableCell className="font-medium">{ep.performerid}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <User className="w-4 h-4 mr-2 text-gray-400" />
                                      {ep.performer_name}
                                    </div>
                                  </TableCell>
                                  <TableCell>{ep.performer_contact}</TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDelete(ep.eventid, ep.performerid)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}