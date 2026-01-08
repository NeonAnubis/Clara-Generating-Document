'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { Input } from '@/components/ui/input'
import { Download, Award, FileText, BookOpen, Search, FileType, UserCheck, FileSignature, Hash, Building2 } from 'lucide-react'

interface Customer {
  id: string
  companyName: string | null
  legalId: string | null
  tradeName: string | null
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
  const [error, setError] = useState<string | null>(null)

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

  // Portada state
  const [portadaCustomerId, setPortadaCustomerId] = useState<string>('')

  // Book Header state
  const [bookHeaderCustomerId, setBookHeaderCustomerId] = useState<string>('')
  const [bookHeaderTomo, setBookHeaderTomo] = useState<string>('PRIMERO')

  // Acceptance letter state
  const [acceptanceCustomerId, setAcceptanceCustomerId] = useState<string>('')
  const [acceptanceManagerIndex, setAcceptanceManagerIndex] = useState<number>(1)

  // Stock Agreement state
  const [stockAgreementCustomerId, setStockAgreementCustomerId] = useState<string>('')

  // Seat Number state
  const [seatNumberCustomerId, setSeatNumberCustomerId] = useState<string>('')

  // Share Capital Certificate state
  const [shareCapitalCustomerId, setShareCapitalCustomerId] = useState<string>('')
  const [shareCapitalShareholderIndex, setShareCapitalShareholderIndex] = useState<number>(0)
  const [shareCapitalConsecutive, setShareCapitalConsecutive] = useState<string>('563-2025')
  const [shareCapitalNotaryName, setShareCapitalNotaryName] = useState<string>('CLARA ALVARADO JIMÉNEZ')
  const [shareCapitalBookAuth, setShareCapitalBookAuth] = useState<string>('4062001346173')
  const [shareCapitalDestinationCountry, setShareCapitalDestinationCountry] = useState<string>('ESTADOS UNIDOS DE AMERICA')

  // Customer filter states
  const [certCustomerFilter, setCertCustomerFilter] = useState<string>('')
  const [actaCustomerFilter, setActaCustomerFilter] = useState<string>('')
  const [portadaCustomerFilter, setPortadaCustomerFilter] = useState<string>('')
  const [wordCustomerFilter, setWordCustomerFilter] = useState<string>('')
  const [bookHeaderCustomerFilter, setBookHeaderCustomerFilter] = useState<string>('')
  const [acceptanceCustomerFilter, setAcceptanceCustomerFilter] = useState<string>('')
  const [stockAgreementCustomerFilter, setStockAgreementCustomerFilter] = useState<string>('')
  const [seatNumberCustomerFilter, setSeatNumberCustomerFilter] = useState<string>('')
  const [shareCapitalCustomerFilter, setShareCapitalCustomerFilter] = useState<string>('')

  // Fetch data with proper error handling
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch customers first (required for all tabs)
      const customersResponse = await fetch('/api/customers?fields=id,companyName,legalId,tradeName,shareholderOne,shareholderTwo,email')
      if (!customersResponse.ok) {
        throw new Error('Failed to fetch customers')
      }
      const customersData = await customersResponse.json()
      setCustomers(Array.isArray(customersData) ? customersData : [])

      // Fetch templates (only active ones, minimal fields for dropdown)
      const templatesResponse = await fetch('/api/templates?active=true&minimal=true')
      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json()
        setTemplates(Array.isArray(templatesData) ? templatesData : [])
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'Error loading data')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch data on mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getCustomerDisplayName = (customer: Customer) => {
    if (customer.companyName) {
      return customer.companyName
    }
    if (customer.shareholderOne) {
      return customer.shareholderOne
    }
    return 'Customer'
  }

  const getCustomerDisplayWithTradeName = (customer: Customer) => {
    const name = getCustomerDisplayName(customer)
    if (customer.tradeName) {
      return `${name} (${customer.tradeName})`
    }
    return name
  }

  const filterCustomers = (filter: string) => {
    if (!filter.trim()) return customers
    const lowerFilter = filter.toLowerCase()
    return customers.filter(customer =>
      (customer.companyName?.toLowerCase().includes(lowerFilter)) ||
      (customer.tradeName?.toLowerCase().includes(lowerFilter)) ||
      (customer.legalId?.toLowerCase().includes(lowerFilter)) ||
      (customer.shareholderOne?.toLowerCase().includes(lowerFilter)) ||
      (customer.shareholderTwo?.toLowerCase().includes(lowerFilter)) ||
      (customer.email?.toLowerCase().includes(lowerFilter))
    )
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

  const handlePortadaExport = async () => {
    if (!portadaCustomerId) return

    setExporting(true)
    try {
      const response = await fetch('/api/export/portada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: portadaCustomerId,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const customer = customers.find(c => c.id === portadaCustomerId)
        const customerName = customer ? getCustomerDisplayName(customer).replace(/\s+/g, '_') : 'customer'
        a.download = `Portada_Libros_${customerName}.docx`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error generating portada:', error)
    } finally {
      setExporting(false)
    }
  }

  const handleBookHeaderExport = async () => {
    if (!bookHeaderCustomerId) return

    setExporting(true)
    try {
      const response = await fetch('/api/export/book-header', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: bookHeaderCustomerId,
          tomo: bookHeaderTomo,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const customer = customers.find(c => c.id === bookHeaderCustomerId)
        const customerName = customer ? getCustomerDisplayName(customer).replace(/\s+/g, '_') : 'customer'
        a.download = `Book_Header_${customerName}.docx`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error generating book header:', error)
    } finally {
      setExporting(false)
    }
  }

  const handleAcceptanceExport = async () => {
    if (!acceptanceCustomerId) return

    setExporting(true)
    try {
      const response = await fetch('/api/export/acceptance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: acceptanceCustomerId,
          managerIndex: acceptanceManagerIndex,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const customer = customers.find(c => c.id === acceptanceCustomerId)
        const customerName = customer ? getCustomerDisplayName(customer).replace(/\s+/g, '_') : 'customer'
        a.download = `Acceptance_Letter_${customerName}.docx`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error generating acceptance letter:', error)
    } finally {
      setExporting(false)
    }
  }

  const handleStockAgreementExport = async () => {
    if (!stockAgreementCustomerId) return

    setExporting(true)
    try {
      const response = await fetch('/api/export/stock-agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: stockAgreementCustomerId,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const customer = customers.find(c => c.id === stockAgreementCustomerId)
        const customerName = customer ? getCustomerDisplayName(customer).replace(/\s+/g, '_') : 'customer'
        a.download = `Stock_Agreement_${customerName}.docx`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error generating stock agreement:', error)
    } finally {
      setExporting(false)
    }
  }

  const handleSeatNumberExport = async () => {
    if (!seatNumberCustomerId) return

    setExporting(true)
    try {
      const response = await fetch('/api/export/seat-number', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: seatNumberCustomerId,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const customer = customers.find(c => c.id === seatNumberCustomerId)
        const customerName = customer ? getCustomerDisplayName(customer).replace(/\s+/g, '_') : 'customer'
        a.download = `Seat_Number_${customerName}.docx`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error generating seat number document:', error)
    } finally {
      setExporting(false)
    }
  }

  const handleShareCapitalCertificateExport = async () => {
    if (!shareCapitalCustomerId) return

    setExporting(true)
    try {
      const response = await fetch('/api/export/share-capital-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: shareCapitalCustomerId,
          shareholderIndex: shareCapitalShareholderIndex,
          consecutiveNumber: shareCapitalConsecutive,
          notaryName: shareCapitalNotaryName,
          bookAuthorizationNumber: shareCapitalBookAuth,
          destinationCountry: shareCapitalDestinationCountry,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const customer = customers.find(c => c.id === shareCapitalCustomerId)
        const customerName = customer ? getCustomerDisplayName(customer).replace(/\s+/g, '_') : 'customer'
        a.download = `Certificacion_Capital_Social_${customerName}.docx`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error generating share capital certificate:', error)
    } finally {
      setExporting(false)
    }
  }

  const getShareCapitalShareholders = () => {
    const customer = customers.find(c => c.id === shareCapitalCustomerId)
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

  if (loading) {
    return <div className="text-center py-8">{tCommon('loading')}</div>
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchData} variant="outline">
          Retry
        </Button>
      </div>
    )
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
          <TabsTrigger value="portada" className="gap-2">
            <BookOpen className="h-4 w-4" />
            {t('portada')}
          </TabsTrigger>
          <TabsTrigger value="book-header" className="gap-2">
            <FileType className="h-4 w-4" />
            {t('bookHeader')}
          </TabsTrigger>
          <TabsTrigger value="acceptance" className="gap-2">
            <UserCheck className="h-4 w-4" />
            {t('acceptance')}
          </TabsTrigger>
          <TabsTrigger value="stock-agreement" className="gap-2">
            <FileSignature className="h-4 w-4" />
            {t('stockAgreement')}
          </TabsTrigger>
          <TabsTrigger value="seat-number" className="gap-2">
            <Hash className="h-4 w-4" />
            {t('seatNumber')}
          </TabsTrigger>
          <TabsTrigger value="share-capital-certificate" className="gap-2">
            <Building2 className="h-4 w-4" />
            {t('shareCapitalCertificate')}
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
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={tCommon('search')}
                      value={wordCustomerFilter}
                      onChange={(e) => setWordCustomerFilter(e.target.value)}
                      className="pl-9 mb-2"
                    />
                  </div>
                  <Select
                    value={selectedCustomerId}
                    onValueChange={setSelectedCustomerId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectCustomerPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {filterCustomers(wordCustomerFilter).map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {getCustomerDisplayWithTradeName(customer)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={tCommon('search')}
                      value={certCustomerFilter}
                      onChange={(e) => setCertCustomerFilter(e.target.value)}
                      className="pl-9 mb-2"
                    />
                  </div>
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
                      {filterCustomers(certCustomerFilter).map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {getCustomerDisplayWithTradeName(customer)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={tCommon('search')}
                    value={actaCustomerFilter}
                    onChange={(e) => setActaCustomerFilter(e.target.value)}
                    className="pl-9 mb-2"
                  />
                </div>
                <Select
                  value={actaCustomerId}
                  onValueChange={setActaCustomerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCustomerPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {filterCustomers(actaCustomerFilter).map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {getCustomerDisplayWithTradeName(customer)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

        <TabsContent value="portada" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('selectCustomer')}</CardTitle>
              <CardDescription>
                {t('selectCustomerForPortada')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={tCommon('search')}
                    value={portadaCustomerFilter}
                    onChange={(e) => setPortadaCustomerFilter(e.target.value)}
                    className="pl-9 mb-2"
                  />
                </div>
                <Select
                  value={portadaCustomerId}
                  onValueChange={setPortadaCustomerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCustomerPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {filterCustomers(portadaCustomerFilter).map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {getCustomerDisplayWithTradeName(customer)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handlePortadaExport}
              disabled={exporting || !portadaCustomerId}
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              {exporting ? t('generating') : t('generatePortada')}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="book-header" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('selectCustomer')}</CardTitle>
                <CardDescription>
                  {t('selectCustomerForBookHeader')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={tCommon('search')}
                      value={bookHeaderCustomerFilter}
                      onChange={(e) => setBookHeaderCustomerFilter(e.target.value)}
                      className="pl-9 mb-2"
                    />
                  </div>
                  <Select
                    value={bookHeaderCustomerId}
                    onValueChange={setBookHeaderCustomerId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectCustomerPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {filterCustomers(bookHeaderCustomerFilter).map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {getCustomerDisplayWithTradeName(customer)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('bookHeaderDetails')}</CardTitle>
                <CardDescription>
                  {t('bookHeaderDetailsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('tomoNumber')}</label>
                  <Select
                    value={bookHeaderTomo}
                    onValueChange={setBookHeaderTomo}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRIMERO">TOMO PRIMERO</SelectItem>
                      <SelectItem value="SEGUNDO">TOMO SEGUNDO</SelectItem>
                      <SelectItem value="TERCERO">TOMO TERCERO</SelectItem>
                      <SelectItem value="CUARTO">TOMO CUARTO</SelectItem>
                      <SelectItem value="QUINTO">TOMO QUINTO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleBookHeaderExport}
              disabled={exporting || !bookHeaderCustomerId}
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              {exporting ? t('generating') : t('generateBookHeader')}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="acceptance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('selectCustomer')}</CardTitle>
                <CardDescription>
                  {t('selectCustomerForAcceptance')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={tCommon('search')}
                      value={acceptanceCustomerFilter}
                      onChange={(e) => setAcceptanceCustomerFilter(e.target.value)}
                      className="pl-9 mb-2"
                    />
                  </div>
                  <Select
                    value={acceptanceCustomerId}
                    onValueChange={setAcceptanceCustomerId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectCustomerPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {filterCustomers(acceptanceCustomerFilter).map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {getCustomerDisplayWithTradeName(customer)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('acceptanceDetails')}</CardTitle>
                <CardDescription>
                  {t('acceptanceDetailsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('selectManager')}</label>
                  <Select
                    value={acceptanceManagerIndex.toString()}
                    onValueChange={(value) => setAcceptanceManagerIndex(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{t('manager1')}</SelectItem>
                      <SelectItem value="2">{t('manager2')}</SelectItem>
                      <SelectItem value="3">{t('subManager')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleAcceptanceExport}
              disabled={exporting || !acceptanceCustomerId}
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              {exporting ? t('generating') : t('generateAcceptance')}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="stock-agreement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('selectCustomer')}</CardTitle>
              <CardDescription>
                {t('selectCustomerForStockAgreement')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={tCommon('search')}
                    value={stockAgreementCustomerFilter}
                    onChange={(e) => setStockAgreementCustomerFilter(e.target.value)}
                    className="pl-9 mb-2"
                  />
                </div>
                <Select
                  value={stockAgreementCustomerId}
                  onValueChange={setStockAgreementCustomerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCustomerPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {filterCustomers(stockAgreementCustomerFilter).map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {getCustomerDisplayWithTradeName(customer)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleStockAgreementExport}
              disabled={exporting || !stockAgreementCustomerId}
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              {exporting ? t('generating') : t('generateStockAgreement')}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="seat-number" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('selectCustomer')}</CardTitle>
              <CardDescription>
                {t('selectCustomerForSeatNumber')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={tCommon('search')}
                    value={seatNumberCustomerFilter}
                    onChange={(e) => setSeatNumberCustomerFilter(e.target.value)}
                    className="pl-9 mb-2"
                  />
                </div>
                <Select
                  value={seatNumberCustomerId}
                  onValueChange={setSeatNumberCustomerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCustomerPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {filterCustomers(seatNumberCustomerFilter).map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {getCustomerDisplayWithTradeName(customer)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleSeatNumberExport}
              disabled={exporting || !seatNumberCustomerId}
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              {exporting ? t('generating') : t('generateSeatNumber')}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="share-capital-certificate" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('selectCustomer')}</CardTitle>
                <CardDescription>
                  {t('selectCustomerForShareCapital')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={tCommon('search')}
                      value={shareCapitalCustomerFilter}
                      onChange={(e) => setShareCapitalCustomerFilter(e.target.value)}
                      className="pl-9 mb-2"
                    />
                  </div>
                  <Select
                    value={shareCapitalCustomerId}
                    onValueChange={(value) => {
                      setShareCapitalCustomerId(value)
                      setShareCapitalShareholderIndex(0)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectCustomerPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {filterCustomers(shareCapitalCustomerFilter).map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {getCustomerDisplayWithTradeName(customer)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {shareCapitalCustomerId && getShareCapitalShareholders().length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('selectShareholder')}</label>
                    <Select
                      value={shareCapitalShareholderIndex.toString()}
                      onValueChange={(value) => setShareCapitalShareholderIndex(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getShareCapitalShareholders().map((holder: { name: string }, index: number) => (
                          <SelectItem key={index} value={index.toString()}>
                            {holder.name || `Shareholder ${index + 1}`}
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
                  {t('shareCapitalCertificateDetails')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('consecutiveNumber')}</label>
                  <Input
                    type="text"
                    value={shareCapitalConsecutive}
                    onChange={(e) => setShareCapitalConsecutive(e.target.value)}
                    placeholder="563-2025"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('notaryName')}</label>
                  <Input
                    type="text"
                    value={shareCapitalNotaryName}
                    onChange={(e) => setShareCapitalNotaryName(e.target.value)}
                    placeholder="CLARA ALVARADO JIMÉNEZ"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('bookAuthNumber')}</label>
                  <Input
                    type="text"
                    value={shareCapitalBookAuth}
                    onChange={(e) => setShareCapitalBookAuth(e.target.value)}
                    placeholder="4062001346173"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('destinationCountry')}</label>
                  <Input
                    type="text"
                    value={shareCapitalDestinationCountry}
                    onChange={(e) => setShareCapitalDestinationCountry(e.target.value)}
                    placeholder="ESTADOS UNIDOS DE AMERICA"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleShareCapitalCertificateExport}
              disabled={exporting || !shareCapitalCustomerId}
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              {exporting ? t('generating') : t('generateShareCapitalCertificate')}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
