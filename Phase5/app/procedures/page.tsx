"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Settings, Database, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface ProcedureExecution {
  id: number
  procedure: string
  parameters: Record<string, any>
  status: "running" | "completed" | "failed"
  startTime: string
  endTime?: string
  result?: string
  error?: string
}

export default function ProceduresPage() {
  const router = useRouter()
  const [executions, setExecutions] = useState<ProcedureExecution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProcedure, setSelectedProcedure] = useState("")
  const [parameters, setParameters] = useState<Record<string, string>>({})
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const procedures = [
    {
      name: "system_maintenance_cleanup",
      description: "Performs system maintenance and cleanup operations",
      parameters: [
        { name: "p_days_old", type: "INTEGER", default: "365", description: "Days old for cleanup threshold" },
        { name: "p_cleanup_mode", type: "VARCHAR", default: "SAFE", description: "Cleanup mode: SAFE or AGGRESSIVE" },
      ],
    },
    {
      name: "update_ticket_pricing_and_promotions",
      description: "Updates ticket pricing based on demand and promotions",
      parameters: [
        { name: "p_event_type", type: "VARCHAR", default: "NULL", description: "Event type filter (optional)" },
        { name: "p_discount_percentage", type: "NUMERIC", default: "10.0", description: "Discount percentage" },
        { name: "p_min_days_before_event", type: "INTEGER", default: "7", description: "Minimum days before event" },
        { name: "p_max_price_increase", type: "NUMERIC", default: "50.0", description: "Maximum price increase" },
      ],
    },
  ]

  const functions = [
    {
      name: "get_events_report",
      description: "Generates detailed events report with statistics",
      parameters: [
        { name: "p_start_date", type: "DATE", default: "CURRENT_DATE", description: "Report start date" },
        { name: "p_end_date", type: "DATE", default: "CURRENT_DATE + 30", description: "Report end date" },
        { name: "p_min_rating", type: "INTEGER", default: "1", description: "Minimum rating filter" },
      ],
    },
    {
      name: "manage_ticket_sales",
      description: "Manages ticket sales with pricing and availability",
      parameters: [
        { name: "p_event_id", type: "INTEGER", default: "", description: "Event ID" },
        { name: "p_customer_id", type: "INTEGER", default: "", description: "Customer ID" },
        { name: "p_ticket_count", type: "INTEGER", default: "1", description: "Number of tickets" },
        { name: "p_max_price", type: "NUMERIC", default: "1000.00", description: "Maximum price limit" },
      ],
    },
  ]

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated")
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    // Simulate loading execution history
    setTimeout(() => {
      const mockExecutions: ProcedureExecution[] = [
        {
          id: 1,
          procedure: "system_maintenance_cleanup",
          parameters: { p_days_old: 365, p_cleanup_mode: "SAFE" },
          status: "completed",
          startTime: "2024-01-15 10:30:00",
          endTime: "2024-01-15 10:32:15",
          result: "Cleanup completed successfully. 15 old events processed, 3 deleted.",
        },
        {
          id: 2,
          procedure: "update_ticket_pricing_and_promotions",
          parameters: { p_event_type: "Concert", p_discount_percentage: 15.0 },
          status: "completed",
          startTime: "2024-01-14 14:20:00",
          endTime: "2024-01-14 14:21:30",
          result: "45 tickets updated with new pricing.",
        },
      ]
      setExecutions(mockExecutions)
      setIsLoading(false)
    }, 1000)
  }, [router])

  const handleProcedureChange = (procedureName: string) => {
    setSelectedProcedure(procedureName)
    const procedure = [...procedures, ...functions].find((p) => p.name === procedureName)
    if (procedure) {
      const defaultParams: Record<string, string> = {}
      procedure.parameters.forEach((param) => {
        defaultParams[param.name] = param.default
      })
      setParameters(defaultParams)
    }
  }

  const handleExecute = async () => {
    if (!selectedProcedure) {
      setError("Please select a procedure or function to execute.")
      return
    }

    setIsExecuting(true)
    setError("")
    setSuccess("")

    try {
      // Simulate execution
      const newExecution: ProcedureExecution = {
        id: executions.length + 1,
        procedure: selectedProcedure,
        parameters: { ...parameters },
        status: "running",
        startTime: new Date().toLocaleString(),
      }

      setExecutions((prev) => [newExecution, ...prev])

      // Simulate execution time
      setTimeout(() => {
        const updatedExecution: ProcedureExecution = {
          ...newExecution,
          status: "completed",
          endTime: new Date().toLocaleString(),
          result: `${selectedProcedure} executed successfully with parameters: ${JSON.stringify(parameters)}`,
        }

        setExecutions((prev) => prev.map((exec) => (exec.id === newExecution.id ? updatedExecution : exec)))

        setSuccess(`${selectedProcedure} executed successfully!`)
        setIsExecuting(false)
      }, 3000)
    } catch (err) {
      setError("Failed to execute procedure. Please try again.")
      setIsExecuting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-yellow-100 text-yellow-800">Running</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading procedures...</p>
        </div>
      </div>
    )
  }

  const selectedProcedureInfo = [...procedures, ...functions].find((p) => p.name === selectedProcedure)

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
              <Settings className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Stored Procedures & Functions</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Execution Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Execute Procedure/Function
              </CardTitle>
              <CardDescription>
                Select and execute stored procedures or functions with custom parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Select Procedure/Function</Label>
                <Select value={selectedProcedure} onValueChange={handleProcedureChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a procedure or function" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">Procedures</div>
                    {procedures.map((proc) => (
                      <SelectItem key={proc.name} value={proc.name}>
                        {proc.name}
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">Functions</div>
                    {functions.map((func) => (
                      <SelectItem key={func.name} value={func.name}>
                        {func.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProcedureInfo && (
                <>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Description</h4>
                    <p className="text-blue-700 text-sm">{selectedProcedureInfo.description}</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Parameters</h4>
                    {selectedProcedureInfo.parameters.map((param) => (
                      <div key={param.name} className="space-y-2">
                        <Label htmlFor={param.name}>
                          {param.name} ({param.type})
                        </Label>
                        <Input
                          id={param.name}
                          value={parameters[param.name] || ""}
                          onChange={(e) =>
                            setParameters((prev) => ({
                              ...prev,
                              [param.name]: e.target.value,
                            }))
                          }
                          placeholder={param.default}
                        />
                        <p className="text-xs text-gray-500">{param.description}</p>
                      </div>
                    ))}
                  </div>

                  <Button onClick={handleExecute} disabled={isExecuting} className="w-full">
                    {isExecuting ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Execute {selectedProcedure}
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Execution History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Execution History
              </CardTitle>
              <CardDescription>Recent procedure and function executions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {executions.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No executions yet</p>
                  </div>
                ) : (
                  executions.map((execution) => (
                    <div key={execution.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(execution.status)}
                          <span className="font-medium">{execution.procedure}</span>
                        </div>
                        {getStatusBadge(execution.status)}
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        <p>Started: {execution.startTime}</p>
                        {execution.endTime && <p>Ended: {execution.endTime}</p>}
                      </div>

                      <div className="text-sm">
                        <p className="font-medium mb-1">Parameters:</p>
                        <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                          {JSON.stringify(execution.parameters, null, 2)}
                        </div>
                      </div>

                      {execution.result && (
                        <div className="mt-2 text-sm">
                          <p className="font-medium mb-1">Result:</p>
                          <div className="bg-green-50 p-2 rounded text-xs">{execution.result}</div>
                        </div>
                      )}

                      {execution.error && (
                        <div className="mt-2 text-sm">
                          <p className="font-medium mb-1">Error:</p>
                          <div className="bg-red-50 p-2 rounded text-xs text-red-700">{execution.error}</div>
                        </div>
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
  )
}
