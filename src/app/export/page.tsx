'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DocumentTemplate } from '@/lib/types'
import { Download, Award, FileText } from 'lucide-react'

interface Customer {
  id: string
  companyName: string | null
  legalId: string | null
  shareholderOne: string | null
  shareholderTwo: string | null
  email: string | null
}

export default function ExportPage() {
  const t = useTranslations('export')
  const tCommon = useTranslations('common')

  const [customers, setCustomers] = useState<Customer[]>([])
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  // Word export state
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')

  // Quota certificate state
  const [certCustomerId, setCertCustomerId] = useState<string>('')
  const [certCuotaholderIndex, setCertCuotaholderIndex] = useState<number>(0)
  const [certNumber, setCertNumber] = useState<string>('001')
  const [certSeries, setCertSeries] = useState<string>('AB')

  // Acta constitutiva state
  const [actaCustomerId, setActaCustomerId] = useState<string>('')

  // Fetch customers and templates on mount
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

  const getCustomerDisplayName = (customer: Customer) => {
    if (customer.companyName) {
      return customer.companyName
    }
    if (customer.shareholderOne) {
      return customer.shareholderOne
    }
    return 'Customer'
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
        const customerName = customer ? getCustomerDisplayName(customer).replace(/\s+/g, '_') : 'customer'
        a.download = `${template?.name}_${customerName}.docx`
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

  const handleCertificateExport = async () => {
    if (!certCustomerId) return

    setExporting(true)
    try {
      const response = await fetch('/api/export/quota-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: certCustomerId,
          cuotaholderIndex: certCuotaholderIndex,
          certificateNumber: certNumber,
          series: certSeries,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Certificado_Cuotas_${certNumber}.docx`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error generating certificate:', error)
    } finally {
      setExporting(false)
    }
  }

  const getSelectedCustomerCuotaholders = () => {
    const customer = customers.find(c => c.id === certCustomerId)
    if (!customer) return []
    const holders = []
    if (customer.shareholderOne) {
      holders.push({ name: customer.shareholderOne })
    }
    if (customer.shareholderTwo) {
      holders.push({ name: customer.shareholderTwo })
    }
    return holders
  }

  const handleActaConstitutivaExport = async () => {
    if (!actaCustomerId) return

    setExporting(true)
    try {
      const response = await fetch('/api/export/acta-constitutiva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: actaCustomerId,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const customer = customers.find(c => c.id === actaCustomerId)
        const customerName = customer ? getCustomerDisplayName(customer).replace(/\s+/g, '_') : 'customer'
        a.download = `Acta_Constitutiva_${customerName}.docx`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error generating acta constitutiva:', error)
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">{tCommon('loading')}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <Tabs defaultValue="certificate" className="space-y-4">
        <TabsList>
          {/* <TabsTrigger value="excel" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            {t('excel')}
          </TabsTrigger>
          <TabsTrigger value="word" className="gap-2">
            <FileText className="h-4 w-4" />
            {t('word')}
          </TabsTrigger> */}
          <TabsTrigger value="certificate" className="gap-2">
            <Award className="h-4 w-4" />
            {t('quotaCertificate')}
          </TabsTrigger>
          <TabsTrigger value="acta-constitutiva" className="gap-2">
            <FileText className="h-4 w-4" />
            {t('actaConstitutiva')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="word" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('selectCustomer')}</CardTitle>
                <CardDescription>
                  {t('selectCustomerDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedCustomerId}
                  onValueChange={setSelectedCustomerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCustomerPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {getCustomerDisplayName(customer)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('selectTemplate')}</CardTitle>
                <CardDescription>
                  {t('selectTemplateDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedTemplateId}
                  onValueChange={setSelectedTemplateId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectTemplatePlaceholder')} />
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
                    {t('noActiveTemplates')}
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
              {exporting ? t('generating') : t('generateWord')}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="certificate" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('selectCustomer')}</CardTitle>
                <CardDescription>
                  {t('selectCustomerForCertificate')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={certCustomerId}
                  onValueChange={(value) => {
                    setCertCustomerId(value)
                    setCertCuotaholderIndex(0)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCustomerPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {getCustomerDisplayName(customer)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {certCustomerId && getSelectedCustomerCuotaholders().length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('selectCuotaholder')}</label>
                    <Select
                      value={certCuotaholderIndex.toString()}
                      onValueChange={(value) => setCertCuotaholderIndex(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getSelectedCustomerCuotaholders().map((holder: { name: string }, index: number) => (
                          <SelectItem key={index} value={index.toString()}>
                            {holder.name || `Cuotaholder ${index + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('certificateDetails')}</CardTitle>
                <CardDescription>
                  {t('certificateDetailsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('certificateNumber')}</label>
                    <input
                      type="text"
                      value={certNumber}
                      onChange={(e) => setCertNumber(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="001"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('certificateSeries')}</label>
                    <input
                      type="text"
                      value={certSeries}
                      onChange={(e) => setCertSeries(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="AB"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleCertificateExport}
              disabled={exporting || !certCustomerId}
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              {exporting ? t('generating') : t('generateCertificate')}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="acta-constitutiva" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('selectCustomer')}</CardTitle>
              <CardDescription>
                {t('selectCustomerForActa')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={actaCustomerId}
                onValueChange={setActaCustomerId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectCustomerPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {getCustomerDisplayName(customer)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleActaConstitutivaExport}
              disabled={exporting || !actaCustomerId}
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              {exporting ? t('generating') : t('generateActa')}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
