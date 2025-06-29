'use client'

import { useState, useEffect } from 'react'

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
  const [events, setEvents] = useState<Event[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
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

  // Fetch all data
  useEffect(() => {
    fetchEvents()
    fetchVenues()
    fetchCustomers()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const fetchVenues = async () => {
    try {
      const response = await fetch('/api/venues')
      if (response.ok) {
        const result = await response.json()
        // Handle the venues API response format
        if (result.success && result.data) {
          setVenues(result.data)
        } else {
          setVenues([])
        }
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
        setCustomers(data)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      setCustomers([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
        fetchEvents() // Refresh the events list
      } else {
        setError(result.error || 'Failed to create event')
      }
    } catch (error) {
      setError('An error occurred while creating the event')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Events Management</h1>
          
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Add Event Form */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Event</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="eventtype" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type *
                </label>
                <input
                  type="text"
                  id="eventtype"
                  name="eventtype"
                  value={formData.eventtype}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event type"
                />
              </div>

              <div>
                <label htmlFor="eventdate" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date *
                </label>
                <input
                  type="date"
                  id="eventdate"
                  name="eventdate"
                  value={formData.eventdate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="available_seats" className="block text-sm font-medium text-gray-700 mb-1">
                  Available Seats *
                </label>
                <input
                  type="number"
                  id="available_seats"
                  name="available_seats"
                  value={formData.available_seats}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter available seats"
                />
              </div>

              <div>
                <label htmlFor="cusid" className="block text-sm font-medium text-gray-700 mb-1">
                  Customer *
                </label>
                <select
                  id="cusid"
                  name="cusid"
                  value={formData.cusid}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.cusid} value={customer.cusid.toString()}>
                      {customer.cusname} (ID: {customer.cusid})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="venid" className="block text-sm font-medium text-gray-700 mb-1">
                  Venue *
                </label>
                <select
                  id="venid"
                  name="venid"
                  value={formData.venid}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Venue</option>
                  {Array.isArray(venues) && venues.map((venue) => (
                    <option key={venue.venid} value={venue.venid.toString()}>
                      {venue.venname} - {venue.location} (Capacity: {venue.capacity.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="additional_fees" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Fees
                </label>
                <input
                  type="text"
                  id="additional_fees"
                  name="additional_fees"
                  value={formData.additional_fees}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter additional fees (optional)"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  {loading ? 'Adding Event...' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>

          {/* Events List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Events List</h2>
            {events.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No events found. Add your first event above.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Event ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Event Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Available Seats
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Venue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Additional Fees
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.eventid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {event.eventid}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {event.eventtype}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(event.eventdate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {event.available_seats.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {event.customer_name || `Customer ID: ${event.cusid}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {event.venue_name || `Venue ID: ${event.venid}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {event.additional_fees || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}