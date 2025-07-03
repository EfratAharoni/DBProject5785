"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { ArrowLeft, Plus, Edit, Trash2, Search, MapPin, Building, DollarSign } from "lucide-react"
import Link from "next/link"

interface Venue {
  venid: number
  venname: string
  capacity: number
  location?: string
  venudescription?: string
  rental_price?: number
  parking?: string
}

export default function VenuesPage() {
  const router = useRouter()
  const [venues, setVenues] = useState<Venue[]>([])
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null)
  const [formData, setFormData] = useState({
    venname: "",
    capacity: "",
    location: "",
    venudescription: "",
    rental_price: "",
    parking: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated")
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    fetchVenues()
  }, [router])

  useEffect(() => {
    const filtered = venues.filter(
      (venue) =>
        venue.venname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.capacity.toString().includes(searchTerm),
    )
    setFilteredVenues(filtered)
  }, [searchTerm, venues])

  const fetchVenues = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/venues')
      const data = await response.json()
      
      if (data.success) {
        setVenues(data.data)
        setFilteredVenues(data.data)
      } else {
        setError(data.error || 'Failed to fetch venues')
      }
    } catch (err) {
      setError('Failed to fetch venues')
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
      const payload = {
        venname: formData.venname,
        capacity: parseInt(formData.capacity),
        location: formData.location.trim() || null,
        venudescription: formData.venudescription.trim() || null,
        rental_price: formData.rental_price ? parseFloat(formData.rental_price) : null,
        parking: formData.parking.trim() || null,
      }

      let response
      if (editingVenue) {
        // Update existing venue
        response = await fetch(`/api/venues/${editingVenue.venid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      } else {
        // Add new venue
        response = await fetch('/api/venues', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      }

      const result = await response.json()
      
      if (result.success) {
        setSuccess(editingVenue ? 'Venue updated successfully!' : 'Venue added successfully!')
        setIsDialogOpen(false)
        setEditingVenue(null)
        setFormData({ venname: "", capacity: "", location: "", venudescription: "", rental_price: "", parking: "" })
        await fetchVenues() // Refresh the list
      } else {
        setError(result.error || 'Failed to save venue')
      }
    } catch (err) {
      setError('Failed to save venue. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue)
    setFormData({
      venname: venue.venname,
      capacity: venue.capacity.toString(),
      location: venue.location || "",
      venudescription: venue.venudescription || "",
      rental_price: venue.rental_price?.toString() || "",
      parking: venue.parking || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (venid: number) => {
    if (window.confirm("Are you sure you want to delete this venue? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/venues/${venid}`, {
          method: 'DELETE',
        })
        
        const result = await response.json()
        
        if (result.success) {
          setSuccess("Venue deleted successfully!")
          await fetchVenues() // Refresh the list
        } else {
          setError(result.error || 'Failed to delete venue')
        }
      } catch (err) {
        setError('Failed to delete venue. Please try again.')
      }
    }
  }

  const openAddDialog = () => {
    setEditingVenue(null)
    setFormData({ venname: "", capacity: "", location: "", venudescription: "", rental_price: "", parking: "" })
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingVenue(null)
    setFormData({ venname: "", capacity: "", location: "", venudescription: "", rental_price: "", parking: "" })
    setError("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading venues...</p>
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
              <MapPin className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Venue Management</h1>
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
                <CardTitle>Venues</CardTitle>
                <CardDescription>Manage venue information and capacity details</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Venue
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingVenue ? "Edit Venue" : "Add New Venue"}</DialogTitle>
                    <DialogDescription>
                      {editingVenue ? "Update venue information" : "Enter venue details to add a new record"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <div>
                        <Label htmlFor="venname">Venue Name *</Label>
                        <Input
                          id="venname"
                          value={formData.venname}
                          onChange={(e) => setFormData((prev) => ({ ...prev, venname: e.target.value }))}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="capacity">Capacity *</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={formData.capacity}
                          onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))}
                          required
                          min="1"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                          placeholder="City, State"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rental_price">Rental Price ($)</Label>
                        <Input
                          id="rental_price"
                          type="number"
                          step="0.01"
                          value={formData.rental_price}
                          onChange={(e) => setFormData((prev) => ({ ...prev, rental_price: e.target.value }))}
                          placeholder="0.00"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="parking">Parking</Label>
                        <Input
                          id="parking"
                          value={formData.parking}
                          onChange={(e) => setFormData((prev) => ({ ...prev, parking: e.target.value }))}
                          placeholder="Parking details"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="venudescription">Description</Label>
                        <Textarea
                          id="venudescription"
                          value={formData.venudescription}
                          onChange={(e) => setFormData((prev) => ({ ...prev, venudescription: e.target.value }))}
                          placeholder="Venue description..."
                          rows={3}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-6">
                      <Button type="button" variant="outline" onClick={closeDialog} disabled={isSubmitting}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : editingVenue ? 'Update' : 'Add'} Venue
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search venues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary">{filteredVenues.length} venues</Badge>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Rental Price</TableHead>
                      <TableHead>Parking</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVenues.map((venue) => (
                      <TableRow key={venue.venid}>
                        <TableCell className="font-medium">{venue.venid}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Building className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <div className="font-medium">{venue.venname}</div>
                              {venue.venudescription && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {venue.venudescription}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{venue.capacity.toLocaleString()}</TableCell>
                        <TableCell>
                          {venue.location ? (
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                              {venue.location}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {venue.rental_price ? (
                            <div className="flex items-center">
                              <DollarSign className="w-3 h-3 mr-1 text-gray-400" />
                              {venue.rental_price.toLocaleString()}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{venue.parking || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(venue)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(venue.venid)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {filteredVenues.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'No venues found matching your search' : 'No venues found'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}