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
import { ArrowLeft, Plus, Edit, Trash2, Search, HandHeart, DollarSign } from "lucide-react"
import Link from "next/link"

interface Sponsor {
  sponsorid: number
  sponsorname: string
  payment?: number
}

export default function SponsorsPage() {
  const router = useRouter()
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [filteredSponsors, setFilteredSponsors] = useState<Sponsor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null)
  const [formData, setFormData] = useState({
    sponsorname: "",
    payment: "",
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

    fetchSponsors()
  }, [router])

  useEffect(() => {
    const filtered = sponsors.filter(
      (sponsor) =>
        sponsor.sponsorname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sponsor.payment?.toString().includes(searchTerm)
    )
    setFilteredSponsors(filtered)
  }, [searchTerm, sponsors])

  const fetchSponsors = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/sponsors')
      const data = await response.json()
      
      if (data.success) {
        setSponsors(data.data)
        setFilteredSponsors(data.data)
      } else {
        setError(data.error || 'Failed to fetch sponsors')
      }
    } catch (err) {
      setError('Failed to fetch sponsors')
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
        sponsorname: formData.sponsorname,
        payment: formData.payment ? parseFloat(formData.payment) : null,
      }

      let response
      if (editingSponsor) {
        // Update existing sponsor
        response = await fetch(`/api/sponsors/${editingSponsor.sponsorid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      } else {
        // Add new sponsor
        response = await fetch('/api/sponsors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      }

      const result = await response.json()
      
      if (result.success) {
        setSuccess(editingSponsor ? 'Sponsor updated successfully!' : 'Sponsor added successfully!')
        setIsDialogOpen(false)
        setEditingSponsor(null)
        setFormData({ sponsorname: "", payment: "" })
        await fetchSponsors() // Refresh the list
      } else {
        setError(result.error || 'Failed to save sponsor')
      }
    } catch (err) {
      setError('Failed to save sponsor. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor)
    setFormData({
      sponsorname: sponsor.sponsorname,
      payment: sponsor.payment?.toString() || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (sponsorid: number) => {
    if (window.confirm("Are you sure you want to delete this sponsor? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/sponsors/${sponsorid}`, {
          method: 'DELETE',
        })
        
        const result = await response.json()
        
        if (result.success) {
          setSuccess("Sponsor deleted successfully!")
          await fetchSponsors() // Refresh the list
        } else {
          setError(result.error || 'Failed to delete sponsor')
        }
      } catch (err) {
        setError('Failed to delete sponsor. Please try again.')
      }
    }
  }

  const openAddDialog = () => {
    setEditingSponsor(null)
    setFormData({ sponsorname: "", payment: "" })
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingSponsor(null)
    setFormData({ sponsorname: "", payment: "" })
    setError("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HandHeart className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading sponsors...</p>
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
              <HandHeart className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Sponsor Management</h1>
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
                <CardTitle>Sponsors</CardTitle>
                <CardDescription>Manage sponsor information and payment details</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Sponsor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingSponsor ? "Edit Sponsor" : "Add New Sponsor"}</DialogTitle>
                    <DialogDescription>
                      {editingSponsor ? "Update sponsor information" : "Enter sponsor details to add a new record"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="sponsorname">Sponsor Name *</Label>
                        <Input
                          id="sponsorname"
                          value={formData.sponsorname}
                          onChange={(e) => setFormData((prev) => ({ ...prev, sponsorname: e.target.value }))}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="payment">Payment Amount ($)</Label>
                        <Input
                          id="payment"
                          type="number"
                          step="0.01"
                          value={formData.payment}
                          onChange={(e) => setFormData((prev) => ({ ...prev, payment: e.target.value }))}
                          placeholder="0.00"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-6">
                      <Button type="button" variant="outline" onClick={closeDialog} disabled={isSubmitting}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : editingSponsor ? 'Update' : 'Add'} Sponsor
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
                  placeholder="Search sponsors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary">{filteredSponsors.length} sponsors</Badge>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Sponsor Name</TableHead>
                      <TableHead>Payment Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSponsors.map((sponsor) => (
                      <TableRow key={sponsor.sponsorid}>
                        <TableCell className="font-medium">{sponsor.sponsorid}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <HandHeart className="w-4 h-4 mr-2 text-gray-400" />
                            <div className="font-medium">{sponsor.sponsorname}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {sponsor.payment ? (
                            <div className="flex items-center">
                              <DollarSign className="w-3 h-3 mr-1 text-gray-400" />
                              {sponsor.payment.toLocaleString()}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(sponsor)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(sponsor.sponsorid)}
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

            {filteredSponsors.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <HandHeart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'No sponsors found matching your search' : 'No sponsors found'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}