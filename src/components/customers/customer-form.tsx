'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Customer } from '@/lib/types'
import { ID_TYPES, CUSTOMER_CATEGORIES } from '@/lib/types'

interface CustomerFormProps {
  customer?: Customer | null
  open: boolean
  onClose: () => void
  onSave: () => void
}

const getInitialFormData = (customer?: Customer | null) => ({
  firstName: customer?.firstName || '',
  lastName: customer?.lastName || '',
  email: customer?.email || '',
  phone: customer?.phone || '',
  mobile: customer?.mobile || '',
  idType: customer?.idType || '',
  idNumber: customer?.idNumber || '',
  address: customer?.address || '',
  city: customer?.city || '',
  state: customer?.state || '',
  country: customer?.country || 'Costa Rica',
  postalCode: customer?.postalCode || '',
  companyName: customer?.companyName || '',
  companyId: customer?.companyId || '',
  position: customer?.position || '',
  notes: customer?.notes || '',
  category: customer?.category || '',
  status: customer?.status || 'active',
})

export function CustomerForm({ customer, open, onClose, onSave }: CustomerFormProps) {
  const t = useTranslations('customerForm')
  const tCustomers = useTranslations('customers')
  const tCommon = useTranslations('common')

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(getInitialFormData(customer))
  const [mounted, setMounted] = useState(false)

  // Handle mounting to avoid SSR hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset form when customer changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(customer))
    }
  }, [customer, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = customer
        ? `/api/customers/${customer.id}`
        : '/api/customers'
      const method = customer ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSave()
        onClose()
      }
    } catch (error) {
      console.error('Error saving customer:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <Dialog open={open} onOpenChange={onClose} modal={true}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {customer ? tCustomers('editCustomer') : tCustomers('newCustomer')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('personalInfo')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('firstName')} *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('lastName')} *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('emailAddress')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('phoneNumber')}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">{t('mobile')}</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Identification */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('identification')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idType">{t('idType')}</Label>
                <Select
                  value={formData.idType}
                  onValueChange={(value) => setFormData({ ...formData, idType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tCommon('select')} />
                  </SelectTrigger>
                  <SelectContent>
                    {ID_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="idNumber">{t('idNumber')}</Label>
                <Input
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('address')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="address">{t('addressLabel')}</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">{t('city')}</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">{t('province')}</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">{t('country')}</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">{t('postalCode')}</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('companyInfo')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">{t('companyName')}</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyId">{t('companyId')}</Label>
                <Input
                  id="companyId"
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">{t('position')}</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('additionalInfo')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">{tCustomers('category')}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tCommon('select')} />
                  </SelectTrigger>
                  <SelectContent>
                    {CUSTOMER_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">{tCustomers('status')}</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{tCustomers('statusActive')}</SelectItem>
                    <SelectItem value="inactive">{tCustomers('statusInactive')}</SelectItem>
                    <SelectItem value="pending">{tCustomers('statusPending')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">{t('notes')}</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              {tCommon('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? tCommon('saving') : tCommon('save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
