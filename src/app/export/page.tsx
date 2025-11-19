'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Customer, DocumentTemplate } from '@/lib/types'
import { CUSTOMER_FIELDS } from '@/lib/types'
import { FileSpreadsheet, FileText, Download } from 'lucide-react'

export default function ExportPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  // Excel export state
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([])
  const [selectedFields, setSelectedFields] = useState<string[]>(
    CUSTOMER_FIELDS.map(f => f.key)
  )

  // Word export state
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')

  useEffect(() => {
    Promise.all([
      fetch('/api/customers').then(r => r.json()),
      fetch('/api/templates').then(r => r.json()),
    ]).then(([customersData, templatesData]) => {
      setCustomers(customersData)
      setTemplates(templatesData.filter((t: DocumentTemplate) => t.isActive))
      setLoading(false)
    })
  }, [])

  const handleExcelExport = async () => {
    setExporting(true)
    try {
      const response = await fetch('/api/export/excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerIds: selectedCustomerIds,
          fields: selectedFields,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `clientes_${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting to Excel:', error)
    } finally {
      setExporting(false)
    }
  }

  const handleWordExport = async () => {
    if (!selectedCustomerId || !selectedTemplateId) return

    setExporting(true)
    try {
      const response = await fetch('/api/export/word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          templateId: selectedTemplateId,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const template = templates.find(t => t.id === selectedTemplateId)
        const customer = customers.find(c => c.id === selectedCustomerId)
        a.download = `${template?.name}_${customer?.lastName}_${customer?.firstName}.docx`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error generating Word document:', error)
    } finally {
      setExporting(false)
    }
  }

  const toggleAllCustomers = () => {
    if (selectedCustomerIds.length === customers.length) {
      setSelectedCustomerIds([])
    } else {
      setSelectedCustomerIds(customers.map(c => c.id))
    }
  }

  const toggleCustomer = (id: string) => {
    setSelectedCustomerIds(prev =>
      prev.includes(id)
        ? prev.filter(cid => cid !== id)
        : [...prev, id]
    )
  }

  const toggleField = (key: string) => {
    setSelectedFields(prev =>
      prev.includes(key)
        ? prev.filter(f => f !== key)
        : [...prev, key]
    )
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exportar Datos</h1>
        <p className="text-muted-foreground">
          Genere archivos Excel o documentos Word con la información de sus clientes
        </p>
      </div>

      <Tabs defaultValue="excel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="excel" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </TabsTrigger>
          <TabsTrigger value="word" className="gap-2">
            <FileText className="h-4 w-4" />
            Word
          </TabsTrigger>
        </TabsList>

        <TabsContent value="excel" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Seleccionar Clientes</CardTitle>
                <CardDescription>
                  Elija los clientes a incluir en el archivo Excel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div className="flex items-center space-x-2 pb-2 border-b">
                    <Checkbox
                      id="all-customers"
                      checked={selectedCustomerIds.length === customers.length}
                      onCheckedChange={toggleAllCustomers}
                    />
                    <label htmlFor="all-customers" className="text-sm font-medium">
                      Seleccionar todos ({customers.length})
                    </label>
                  </div>
                  {customers.map(customer => (
                    <div key={customer.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={customer.id}
                        checked={selectedCustomerIds.includes(customer.id)}
                        onCheckedChange={() => toggleCustomer(customer.id)}
                      />
                      <label htmlFor={customer.id} className="text-sm">
                        {customer.firstName} {customer.lastName}
                        {customer.companyName && (
                          <span className="text-muted-foreground ml-1">
                            ({customer.companyName})
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campos a Exportar</CardTitle>
                <CardDescription>
                  Seleccione las columnas para el archivo Excel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {CUSTOMER_FIELDS.map(field => (
                    <div key={field.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`field-${field.key}`}
                        checked={selectedFields.includes(field.key)}
                        onCheckedChange={() => toggleField(field.key)}
                      />
                      <label htmlFor={`field-${field.key}`} className="text-sm">
                        {field.label}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleExcelExport}
              disabled={exporting || selectedFields.length === 0}
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              {exporting ? 'Exportando...' : 'Exportar a Excel'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="word" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Seleccionar Cliente</CardTitle>
                <CardDescription>
                  Elija el cliente para generar el documento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedCustomerId}
                  onValueChange={setSelectedCustomerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName}
                        {customer.companyName && ` (${customer.companyName})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seleccionar Plantilla</CardTitle>
                <CardDescription>
                  Elija la plantilla de documento a generar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedTemplateId}
                  onValueChange={setSelectedTemplateId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una plantilla..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                        {template.category && (
                          <span className="text-muted-foreground ml-1">
                            ({template.category})
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {templates.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    No hay plantillas activas. Cree una en la sección de Plantillas.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleWordExport}
              disabled={exporting || !selectedCustomerId || !selectedTemplateId}
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              {exporting ? 'Generando...' : 'Generar Documento Word'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
