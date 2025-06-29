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
import { ArrowLeft, Plus, Edit, Trash2, Search, Users } from "lucide-react"
import Link from "next/link"

interface Customer {
  cusid: number
  cusname: string
  cuscontactinfo: string
  cusemail: string
}

export default function CustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    cusid: "",
    cusname: "",
    cuscontactinfo: "",
    cusemail: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // פונקציה לטעינת לקוחות מהשרת
  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/customers')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setCustomers(data)
      setFilteredCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
      setError('שגיאה בטעינת נתוני הלקוחות. אנא בדוק את החיבור למסד הנתונים.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated")
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    // טעינת נתונים אמיתיים מהשרת
    fetchCustomers()
  }, [router])

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.cusname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.cusemail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.cuscontactinfo.includes(searchTerm),
    )
    setFilteredCustomers(filtered)
  }, [searchTerm, customers])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const method = editingCustomer ? 'PUT' : 'POST'
      const url = editingCustomer ? `/api/customers/${editingCustomer.cusid}` : '/api/customers'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cusname: formData.cusname,
          cuscontactinfo: formData.cuscontactinfo,
          cusemail: formData.cusemail,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (editingCustomer) {
        setSuccess("הלקוח עודכן בהצלחה!")
      } else {
        setSuccess("הלקוח נוסף בהצלחה!")
      }

      // רענון נתונים
      await fetchCustomers()
      
      setIsDialogOpen(false)
      setEditingCustomer(null)
      setFormData({ cusid: "", cusname: "", cuscontactinfo: "", cusemail: "" })
    } catch (err) {
      console.error('Error saving customer:', err)
      setError("שגיאה בשמירת הלקוח. אנא נסה שוב.")
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      cusid: customer.cusid.toString(),
      cusname: customer.cusname,
      cuscontactinfo: customer.cuscontactinfo,
      cusemail: customer.cusemail,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (cusid: number) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק לקוח זה?")) {
      try {
        const response = await fetch(`/api/customers/${cusid}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        setSuccess("הלקוח נמחק בהצלחה!")
        
        // רענון נתונים
        await fetchCustomers()
      } catch (err) {
        console.error('Error deleting customer:', err)
        setError("שגיאה במחיקת הלקוח. אנא נסה שוב.")
      }
    }
  }

  const openAddDialog = () => {
    setEditingCustomer(null)
    setFormData({ cusid: "", cusname: "", cuscontactinfo: "", cusemail: "" })
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">טוען לקוחות...</p>
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
                  חזרה
                </Button>
              </Link>
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">ניהול לקוחות</h1>
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
                <CardTitle>לקוחות</CardTitle>
                <CardDescription>ניהול מידע ורשומות לקוחות</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    הוסף לקוח
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCustomer ? "ערוך לקוח" : "הוסף לקוח חדש"}</DialogTitle>
                    <DialogDescription>
                      {editingCustomer ? "עדכן מידע הלקוח" : "הזן פרטי לקוח להוספת רשומה חדשה"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cusname">שם הלקוח</Label>
                        <Input
                          id="cusname"
                          value={formData.cusname}
                          onChange={(e) => setFormData((prev) => ({ ...prev, cusname: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cuscontactinfo">פרטי התקשרות</Label>
                        <Input
                          id="cuscontactinfo"
                          value={formData.cuscontactinfo}
                          onChange={(e) => setFormData((prev) => ({ ...prev, cuscontactinfo: e.target.value }))}
                          placeholder="מספר טלפון או פרטי התקשרות"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cusemail">אימייל</Label>
                        <Input
                          id="cusemail"
                          type="email"
                          value={formData.cusemail}
                          onChange={(e) => setFormData((prev) => ({ ...prev, cusemail: e.target.value }))}
                          placeholder="customer@email.com"
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-6">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        ביטול
                      </Button>
                      <Button type="submit">{editingCustomer ? "עדכן" : "הוסף"} לקוח</Button>
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
                  placeholder="חפש לקוחות..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary">{filteredCustomers.length} לקוחות</Badge>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>שם</TableHead>
                    <TableHead>פרטי התקשרות</TableHead>
                    <TableHead>אימייל</TableHead>
                    <TableHead className="text-right">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.cusid}>
                      <TableCell className="font-medium">{customer.cusid}</TableCell>
                      <TableCell>{customer.cusname}</TableCell>
                      <TableCell>{customer.cuscontactinfo}</TableCell>
                      <TableCell>{customer.cusemail}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(customer)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(customer.cusid)}
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

            {filteredCustomers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">לא נמצאו לקוחות</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}