'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Pencil, Save, X } from 'lucide-react'

interface Customer {
  id: string
  // Company Information
  companyName: string | null
  companyType: string | null
  abbreviation: string | null
  legalId: string | null
  shareCapital: string | null
  numberOfShares: string | null
  shareValue: string | null
  series: string | null
  registeredAddress: string | null
  companyTerm: number | null
  incorporationDate: string | null

  // Shareholder 1
  shareholderOne: string | null
  certificateNumber: number | null
  identification: string | null
  ownership: string | null
  numberOfSharesHeld: number | null
  date: number | null
  month: string | null
  year: number | null
  print: string | null
  excelId: number | null
  capitalNumber: string | null
  maritalStatus: string | null
  profession: string | null
  shareholder1Address: string | null
  reference: string | null
  sharesInWords1: string | null
  percentage1: string | null

  // Shareholder 2
  certificateNumber2: number | null
  reference2: string | null
  shareholder2Address: string | null
  profession2: string | null
  maritalStatus2: string | null
  shareholderTwo: string | null
  identification2: string | null
  ownership2: string | null
  percentage2: string | null
  sharesInNumbers2: string | null
  numberOfSharesHeld2: number | null

  // Additional Fields
  field1: number | null
  legalIdInWords: string | null
  renewalStartDate: string | null
  active: number | null
  archived: number | null
  cooperator: string | null
  legalRepresentative: string | null
  representativeId: string | null
  activeTaxation: number | null

  // Manager 1
  managerFirstName: string | null
  managerId: string | null
  managerAddress: string | null
  managerOccupation: string | null
  managerMaritalStatus: string | null
  managerNationality: string | null
  managerLastName: string | null

  // Manager 2
  manager2FirstName: string | null
  manager2LastName: string | null
  manager2Id: string | null
  manager2Address: string | null
  manager2Occupation: string | null
  manager2MaritalStatus: string | null
  manager2Nationality: string | null

  // Sub-manager
  subManagerFirstName: string | null
  subManagerLastName: string | null
  subManagerId: string | null
  subManagerAddress: string | null
  subManagerOccupation: string | null
  subManagerMaritalStatus: string | null
  subManagerNationality: string | null

  // Other
  denomination: string | null
  idInNumbers: string | null
  dissolvedRecord: number | null
  bookLegalization: string | null
  email: string | null
  tradeName: string | null

  createdAt: string
  updatedAt: string
}

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const t = useTranslations('customerForm')
  const tCommon = useTranslations('common')
  const { toast } = useToast()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null)

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`/api/customers/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch customer')
      const data = await response.json()
      setCustomer(data)
      setEditedCustomer(data)
    } catch (error) {
      console.error('Error fetching customer:', error)
      toast({
        title: 'Error',
        description: 'Failed to load customer data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomer()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const handleEdit = () => {
    setIsEditing(true)
    setEditedCustomer(customer)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedCustomer(customer)
  }

  const handleSave = async () => {
    if (!editedCustomer) return

    setSaving(true)
    try {
      const response = await fetch(`/api/customers/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedCustomer),
      })

      if (!response.ok) throw new Error('Failed to update customer')

      const updated = await response.json()
      setCustomer(updated)
      setEditedCustomer(updated)
      setIsEditing(false)

      toast({
        title: 'Success',
        description: 'Customer updated successfully',
      })
    } catch (error) {
      console.error('Error updating customer:', error)
      toast({
        title: 'Error',
        description: 'Failed to update customer',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof Customer, value: string | number | null) => {
    if (!editedCustomer) return
    setEditedCustomer({ ...editedCustomer, [field]: value })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">{tCommon('loading')}</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-destructive">Customer not found</p>
        </div>
      </div>
    )
  }

  const displayCustomer = isEditing ? editedCustomer : customer

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/customers')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {displayCustomer?.companyName || 'Customer Details'}
            </h1>
            <p className="text-muted-foreground">
              {displayCustomer?.legalId || 'No Legal ID'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                {tCommon('cancel')}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? tCommon('saving') : tCommon('save')}
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              {tCommon('edit')}
            </Button>
          )}
        </div>
      </div>

      {/* Company Information */}
      <div className="space-y-6">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">{t('companyInfo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('companyName')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.companyName || ''}
                  onChange={(e) => updateField('companyName', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.companyName || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('companyType')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.companyType || ''}
                  onChange={(e) => updateField('companyType', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.companyType || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('abbreviation')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.abbreviation || ''}
                  onChange={(e) => updateField('abbreviation', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.abbreviation || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('legalId')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.legalId || ''}
                  onChange={(e) => updateField('legalId', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.legalId || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('shareCapital')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.shareCapital || ''}
                  onChange={(e) => updateField('shareCapital', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.shareCapital || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('numberOfShares')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.numberOfShares || ''}
                  onChange={(e) => updateField('numberOfShares', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.numberOfShares || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('shareValue')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.shareValue || ''}
                  onChange={(e) => updateField('shareValue', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.shareValue || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('series')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.series || ''}
                  onChange={(e) => updateField('series', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.series || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('registeredAddress')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.registeredAddress || ''}
                  onChange={(e) => updateField('registeredAddress', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.registeredAddress || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('companyTerm')}</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={displayCustomer?.companyTerm || ''}
                  onChange={(e) => updateField('companyTerm', e.target.value ? parseInt(e.target.value) : null)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.companyTerm || '-'}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>{t('incorporationDate')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.incorporationDate || ''}
                  onChange={(e) => updateField('incorporationDate', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.incorporationDate || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Shareholder 1 */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">{t('shareholder1')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('shareholderOne')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.shareholderOne || ''}
                  onChange={(e) => updateField('shareholderOne', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.shareholderOne || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('identification')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.identification || ''}
                  onChange={(e) => updateField('identification', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.identification || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('certificateNumber')}</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={displayCustomer?.certificateNumber || ''}
                  onChange={(e) => updateField('certificateNumber', e.target.value ? parseInt(e.target.value) : null)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.certificateNumber || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('ownership')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.ownership || ''}
                  onChange={(e) => updateField('ownership', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.ownership || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('numberOfSharesHeld')}</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={displayCustomer?.numberOfSharesHeld || ''}
                  onChange={(e) => updateField('numberOfSharesHeld', e.target.value ? parseInt(e.target.value) : null)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.numberOfSharesHeld || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('percentage1')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.percentage1 || ''}
                  onChange={(e) => updateField('percentage1', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.percentage1 || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('maritalStatus')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.maritalStatus || ''}
                  onChange={(e) => updateField('maritalStatus', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.maritalStatus || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('profession')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.profession || ''}
                  onChange={(e) => updateField('profession', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.profession || '-'}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>{t('shareholder1Address')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.shareholder1Address || ''}
                  onChange={(e) => updateField('shareholder1Address', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.shareholder1Address || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('reference')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.reference || ''}
                  onChange={(e) => updateField('reference', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.reference || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('sharesInWords1')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.sharesInWords1 || ''}
                  onChange={(e) => updateField('sharesInWords1', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.sharesInWords1 || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('date')}</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={displayCustomer?.date || ''}
                  onChange={(e) => updateField('date', e.target.value ? parseInt(e.target.value) : null)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.date || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('month')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.month || ''}
                  onChange={(e) => updateField('month', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.month || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('year')}</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={displayCustomer?.year || ''}
                  onChange={(e) => updateField('year', e.target.value ? parseInt(e.target.value) : null)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.year || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('print')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.print || ''}
                  onChange={(e) => updateField('print', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.print || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('excelId')}</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={displayCustomer?.excelId || ''}
                  onChange={(e) => updateField('excelId', e.target.value ? parseInt(e.target.value) : null)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.excelId || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('capitalNumber')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.capitalNumber || ''}
                  onChange={(e) => updateField('capitalNumber', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.capitalNumber || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Shareholder 2 */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">{t('shareholder2')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('shareholderTwo')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.shareholderTwo || ''}
                  onChange={(e) => updateField('shareholderTwo', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.shareholderTwo || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('identification2')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.identification2 || ''}
                  onChange={(e) => updateField('identification2', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.identification2 || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('certificateNumber2')}</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={displayCustomer?.certificateNumber2 || ''}
                  onChange={(e) => updateField('certificateNumber2', e.target.value ? parseInt(e.target.value) : null)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.certificateNumber2 || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('ownership2')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.ownership2 || ''}
                  onChange={(e) => updateField('ownership2', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.ownership2 || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('numberOfSharesHeld2')}</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={displayCustomer?.numberOfSharesHeld2 || ''}
                  onChange={(e) => updateField('numberOfSharesHeld2', e.target.value ? parseInt(e.target.value) : null)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.numberOfSharesHeld2 || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('percentage2')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.percentage2 || ''}
                  onChange={(e) => updateField('percentage2', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.percentage2 || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('maritalStatus2')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.maritalStatus2 || ''}
                  onChange={(e) => updateField('maritalStatus2', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.maritalStatus2 || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('profession2')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.profession2 || ''}
                  onChange={(e) => updateField('profession2', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.profession2 || '-'}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>{t('shareholder2Address')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.shareholder2Address || ''}
                  onChange={(e) => updateField('shareholder2Address', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.shareholder2Address || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('reference2')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.reference2 || ''}
                  onChange={(e) => updateField('reference2', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.reference2 || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('sharesInNumbers2')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.sharesInNumbers2 || ''}
                  onChange={(e) => updateField('sharesInNumbers2', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.sharesInNumbers2 || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Manager 1 */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">{t('manager1')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('managerFirstName')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.managerFirstName || ''}
                  onChange={(e) => updateField('managerFirstName', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.managerFirstName || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('managerLastName')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.managerLastName || ''}
                  onChange={(e) => updateField('managerLastName', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.managerLastName || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('managerId')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.managerId || ''}
                  onChange={(e) => updateField('managerId', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.managerId || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('managerMaritalStatus')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.managerMaritalStatus || ''}
                  onChange={(e) => updateField('managerMaritalStatus', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.managerMaritalStatus || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('managerOccupation')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.managerOccupation || ''}
                  onChange={(e) => updateField('managerOccupation', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.managerOccupation || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('managerNationality')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.managerNationality || ''}
                  onChange={(e) => updateField('managerNationality', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.managerNationality || '-'}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>{t('managerAddress')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.managerAddress || ''}
                  onChange={(e) => updateField('managerAddress', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.managerAddress || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Manager 2 */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">{t('manager2')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('manager2FirstName')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.manager2FirstName || ''}
                  onChange={(e) => updateField('manager2FirstName', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.manager2FirstName || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('manager2LastName')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.manager2LastName || ''}
                  onChange={(e) => updateField('manager2LastName', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.manager2LastName || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('manager2Id')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.manager2Id || ''}
                  onChange={(e) => updateField('manager2Id', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.manager2Id || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('manager2MaritalStatus')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.manager2MaritalStatus || ''}
                  onChange={(e) => updateField('manager2MaritalStatus', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.manager2MaritalStatus || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('manager2Occupation')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.manager2Occupation || ''}
                  onChange={(e) => updateField('manager2Occupation', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.manager2Occupation || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('manager2Nationality')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.manager2Nationality || ''}
                  onChange={(e) => updateField('manager2Nationality', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.manager2Nationality || '-'}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>{t('manager2Address')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.manager2Address || ''}
                  onChange={(e) => updateField('manager2Address', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.manager2Address || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sub-manager */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">{t('subManager')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('subManagerFirstName')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.subManagerFirstName || ''}
                  onChange={(e) => updateField('subManagerFirstName', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.subManagerFirstName || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('subManagerLastName')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.subManagerLastName || ''}
                  onChange={(e) => updateField('subManagerLastName', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.subManagerLastName || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('subManagerId')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.subManagerId || ''}
                  onChange={(e) => updateField('subManagerId', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.subManagerId || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('subManagerMaritalStatus')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.subManagerMaritalStatus || ''}
                  onChange={(e) => updateField('subManagerMaritalStatus', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.subManagerMaritalStatus || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('subManagerOccupation')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.subManagerOccupation || ''}
                  onChange={(e) => updateField('subManagerOccupation', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.subManagerOccupation || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('subManagerNationality')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.subManagerNationality || ''}
                  onChange={(e) => updateField('subManagerNationality', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.subManagerNationality || '-'}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>{t('subManagerAddress')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.subManagerAddress || ''}
                  onChange={(e) => updateField('subManagerAddress', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.subManagerAddress || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">{t('additionalInfo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('email')}</Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={displayCustomer?.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.email || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('tradeName')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.tradeName || ''}
                  onChange={(e) => updateField('tradeName', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.tradeName || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('cooperator')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.cooperator || ''}
                  onChange={(e) => updateField('cooperator', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.cooperator || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('legalRepresentative')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.legalRepresentative || ''}
                  onChange={(e) => updateField('legalRepresentative', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.legalRepresentative || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('representativeId')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.representativeId || ''}
                  onChange={(e) => updateField('representativeId', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.representativeId || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('denomination')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.denomination || ''}
                  onChange={(e) => updateField('denomination', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.denomination || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('legalIdInWords')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.legalIdInWords || ''}
                  onChange={(e) => updateField('legalIdInWords', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.legalIdInWords || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('idInNumbers')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.idInNumbers || ''}
                  onChange={(e) => updateField('idInNumbers', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.idInNumbers || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('renewalStartDate')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.renewalStartDate || ''}
                  onChange={(e) => updateField('renewalStartDate', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.renewalStartDate || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('field1')}</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={displayCustomer?.field1 || ''}
                  onChange={(e) => updateField('field1', e.target.value ? parseInt(e.target.value) : null)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.field1 || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('active')}</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={displayCustomer?.active || ''}
                  onChange={(e) => updateField('active', e.target.value ? parseInt(e.target.value) : null)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.active || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('archived')}</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={displayCustomer?.archived || ''}
                  onChange={(e) => updateField('archived', e.target.value ? parseInt(e.target.value) : null)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.archived || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('activeTaxation')}</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={displayCustomer?.activeTaxation || ''}
                  onChange={(e) => updateField('activeTaxation', e.target.value ? parseInt(e.target.value) : null)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.activeTaxation || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('dissolvedRecord')}</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={displayCustomer?.dissolvedRecord || ''}
                  onChange={(e) => updateField('dissolvedRecord', e.target.value ? parseInt(e.target.value) : null)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.dissolvedRecord || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('bookLegalization')}</Label>
              {isEditing ? (
                <Input
                  value={displayCustomer?.bookLegalization || ''}
                  onChange={(e) => updateField('bookLegalization', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{displayCustomer?.bookLegalization || '-'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
