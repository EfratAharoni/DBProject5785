"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Calendar, Plus, Users, Building2 } from "lucide-react"
import Link from "next/link"

interface Venue {
  venid: number
  venname: string
  location: string
  capacity: number
  venudescription?: string
  rental_price?: number
  parking?: string
}

interface Customer {
  cusid: number
  cusname: string
  cuscontactinfo?: string
  cusemail?: string
}

interface Event {
  eventid: number
  eventtype: string
  eventdate: string
  available_seats: number
  additional_fees?: string
  cusid: number
  venid: number
  venue_name?: string
  customer_name?: string
}

export default function EventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    eventtype: '',
    eventdate: '',
    available_seats: '',
    additional_fees: '',
    cusid: '',
    venid: ''
  })

  // Check authentication and fetch data
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated")
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    fetchAllData()
  }, [router])

  const fetchAllData = async () => {
    setIsLoading(true)
    await Promise.all([
      fetchEvents(),
      fetchVenues(),
      fetchCustomers()
    ])
    setIsLoading(false)
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        // Handle different API response formats
        if (Array.isArray(data)) {
          setEvents(data)
        } else if (data.success && Array.isArray(data.data)) {
          setEvents(data.data)
        } else if (data.data && Array.isArray(data.data)) {
          setEvents(data.data)
        } else {
          console.warn('Unexpected events API response format:', data)
          setEvents([])
        }
      } else {
        console.error('Failed to fetch events:', response.status)
        setEvents([])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents([])
    }
  }

  const fetchVenues = async () => {
    try {
      const response = await fetch('/api/venues')
      if (response.ok) {
        const result = await response.json()
        // Handle different API response formats
        if (Array.isArray(result)) {
          setVenues(result)
        } else if (result.success && Array.isArray(result.data)) {
          setVenues(result.data)
        } else if (result.data && Array.isArray(result.data)) {
          setVenues(result.data)
        } else {
          console.warn('Unexpected venues API response format:', result)
          setVenues([])
        }
      } else {
        console.error('Failed to fetch venues:', response.status)
        setVenues([])
      }
    } catch (error) {
      console.error('Error fetching venues:', error)
      setVenues([])
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        // Handle different API response formats
        if (Array.isArray(data)) {
          setCustomers(data)
        } else if (data.success && Array.isArray(data.data)) {
          setCustomers(data.data)
        } else if (data.data && Array.isArray(data.data)) {
          setCustomers(data.data)
        } else {
          console.warn('Unexpected customers API response format:', data)
          setCustomers([])
        }
      } else {
        console.error('Failed to fetch customers:', response.status)
        setCustomers([])
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      setCustomers([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventtype: formData.eventtype,
          eventdate: formData.eventdate,
          available_seats: parseInt(formData.available_seats),
          additional_fees: formData.additional_fees || null,
          cusid: parseInt(formData.cusid),
          venid: parseInt(formData.venid)
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess('Event created successfully!')
        setFormData({
          eventtype: '',
          eventdate: '',
          available_seats: '',
          additional_fees: '',
          cusid: '',
          venid: ''
        })
        setIsDialogOpen(false)
        fetchEvents() // Refresh the events list
      } else {
        setError(result.error || 'Failed to create event')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      setError('An error occurred while creating the event')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('he-IL')
    } catch {
      return dateString
    }
  }

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  const openAddDialog = () => {
    setFormData({
      eventtype: '',
      eventdate: '',
      available_seats: '',
      additional_fees: '',
      cusid: '',
      venid: ''
    })
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading events...</p>
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
              <Calendar className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Events Management</h1>
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

        {/* Events List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Events List</CardTitle>
                <CardDescription>Manage all your events</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{events.length} events</Badge>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openAddDialog}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Event
                      </DialogTitle>
                      <DialogDescription>Create a new event by filling out the information below</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="eventtype">Event Type *</Label>
                            <Input
                              id="eventtype"
                              value={formData.eventtype}
                              onChange={(e) => handleInputChange('eventtype', e.target.value)}
                              placeholder="Enter event type"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="eventdate">Event Date *</Label>
                            <Input
                              id="eventdate"
                              type="date"
                              value={formData.eventdate}
                              onChange={(e) => handleInputChange('eventdate', e.target.value)}
                              min={getTodayDate()}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="available_seats">Available Seats *</Label>
                            <Input
                              id="available_seats"
                              type="number"
                              value={formData.available_seats}
                              onChange={(e) => handleInputChange('available_seats', e.target.value)}
                              placeholder="Enter available seats"
                              min="1"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="additional_fees">Additional Fees</Label>
                            <Input
                              id="additional_fees"
                              value={formData.additional_fees}
                              onChange={(e) => handleInputChange('additional_fees', e.target.value)}
                              placeholder="Enter additional fees (optional)"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cusid">Customer *</Label>
                            <Select
                              value={formData.cusid}
                              onValueChange={(value) => handleInputChange('cusid', value)}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Customer" />
                              </SelectTrigger>
                              <SelectContent>
                                {customers.map((customer) => (
                                  <SelectItem key={customer.cusid} value={customer.cusid.toString()}>
                                    {customer.cusname} (ID: {customer.cusid})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="venid">Venue *</Label>
                            <Select
                              value={formData.venid}
                              onValueChange={(value) => handleInputChange('venid', value)}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Venue" />
                              </SelectTrigger>
                              <SelectContent>
                                {venues.map((venue) => (
                                  <SelectItem key={venue.venid} value={venue.venid.toString()}>
                                    {venue.venname} - {venue.location} (Cap: {venue.capacity.toLocaleString()})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
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
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Adding Event...' : 'Add Event'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No events found</p>
                <p className="text-gray-400">Add your first event using the button above</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Available Seats</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Additional Fees</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.eventid}>
                        <TableCell className="font-medium">{event.eventid}</TableCell>
                        <TableCell>{event.eventtype}</TableCell>
                        <TableCell>{formatDate(event.eventdate)}</TableCell>
                        <TableCell>{event.available_seats.toLocaleString()}</TableCell>
                        <TableCell>
                          {event.customer_name || `Customer ID: ${event.cusid}`}
                        </TableCell>
                        <TableCell>
                          {event.venue_name || `Venue ID: ${event.venid}`}
                        </TableCell>
                        <TableCell>{event.additional_fees || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}