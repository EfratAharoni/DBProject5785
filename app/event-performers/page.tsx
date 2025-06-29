"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { ArrowLeft, Plus, Trash2, Star, Calendar, User } from "lucide-react"
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

  // Group performers by event
  const groupedByEvent = eventPerformers.reduce(
    (acc, ep) => {
      if (!acc[ep.eventid]) {
        acc[ep.eventid] = []
      }
      acc[ep.eventid].push(ep)
      return acc
    },
    {} as Record<number, EventPerformer[]>,
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
                  <p className="text-gray-500">No performer assignments found</p>
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
                              Event {eventId} - {eventInfo.event_type}
                            </CardTitle>
                            <CardDescription>
                              {eventInfo.event_date && new Date(eventInfo.event_date).toLocaleDateString()}
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
                                <TableHead>Performer Name</TableHead>
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