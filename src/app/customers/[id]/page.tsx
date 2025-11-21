'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Pencil } from 'lucide-react'

interface PersonInfo {
  lastName: string
  givenNames: string
  fullAddress: string
  passportNumber: string
  expiryDate: string
  dateOfBirth: string
  placeOfBirth: string
  countryOfTaxResidency: string
  emailAddress: string
  telephoneNumber: string
  profession: string
  maritalStatus: string
  numberOfSharesHeld: string
  ownershipPercentage?: string
}

interface CorporateCuotaholder {
  companyName: string
  registeredAddress: string
  taxIdRegistration: string
  jurisdiction: string
  dateOfIncorporation: string
  uboSameAsNewCompany: boolean
  numberOfSharesHeld: string
}

interface CustomerData {
  id: string
  primaryContactName: string
  primaryContactEmail: string
  secondaryContactName: string
  secondaryContactEmail: string
  onlyPrimarySecondaryNotified: boolean
  individualCuotaholders: PersonInfo[]
  corporateCuotaholders: CorporateCuotaholder[]
  uboSameAsCuotaholder: boolean
  ubos: PersonInfo[]
  directorSameAsCuotaholder: boolean
  directors: PersonInfo[]
  nominalValueOfCuotas: string
  numberOfCuotasToBeIssued: string
  natureOfBusiness: string
}

const emptyPersonInfo: PersonInfo = {
  lastName: '', givenNames: '', fullAddress: '', passportNumber: '',
  expiryDate: '', dateOfBirth: '', placeOfBirth: '', countryOfTaxResidency: '',
  emailAddress: '', telephoneNumber: '', profession: '', maritalStatus: '',
  numberOfSharesHeld: '', ownershipPercentage: ''
}

const emptyCorporate: CorporateCuotaholder = {
  companyName: '', registeredAddress: '', taxIdRegistration: '',
  jurisdiction: '', dateOfIncorporation: '', uboSameAsNewCompany: false, numberOfSharesHeld: ''
}

// Header Component
function FormHeader({ t }: { t: (key: string) => string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between py-4">
        <div className="text-[#4a4a8a] dark:text-blue-400">
          <p className="text-lg italic font-medium">! {t('formsMustBeDigital')}</p>
          <p className="text-lg italic font-medium">{t('handwrittenNotAccepted')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-[#4a4a8a] rounded flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 8H24V12H12V16H20V20H12V28H8V8Z" fill="white"/>
              <path d="M14 12L20 12" stroke="#c9a227" strokeWidth="2"/>
              <path d="M14 20L18 20" stroke="#c9a227" strokeWidth="2"/>
            </svg>
          </div>
          <div className="text-[#4a4a8a] dark:text-slate-300">
            <div className="flex gap-3 text-sm tracking-[0.3em] font-light">
              <span>F</span><span>A</span><span>S</span><span>T</span>
            </div>
            <div className="text-sm tracking-[0.15em] font-light border-t border-[#4a4a8a] dark:border-slate-400 pt-1">
              OFFSHORE
            </div>
          </div>
        </div>
      </div>
      <div className="border-b-2 border-[#4a4a8a] dark:border-slate-500" />
    </div>
  )
}

// Section title component
function SectionTitle({ number, title, subtitle, sectionLabel }: { number: number; title: string; subtitle?: string; sectionLabel: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-semibold text-blue-800 dark:text-blue-400">
        {sectionLabel} {number} – {title}
        {subtitle && <span className="font-normal text-red-600 dark:text-red-400"> ({subtitle})</span>}
      </h3>
    </div>
  )
}

export default function CustomerViewPage() {
  const params = useParams()
  const id = params.id as string
  const t = useTranslations('companyForm')
  const tCommon = useTranslations('common')

  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [formData, setFormData] = useState<CustomerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/customers/${id}`)
        if (response.ok) {
          const data = await response.json()
          setCustomer(data)
          setFormData(data)
        }
      } catch (error) {
        console.error('Error fetching customer:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomer()
  }, [id])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData(customer)
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!formData) return
    setSaving(true)
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        // Re-fetch to get parsed JSON fields
        const refetchResponse = await fetch(`/api/customers/${id}`)
        if (refetchResponse.ok) {
          const refetchedData = await refetchResponse.json()
          setCustomer(refetchedData)
          setFormData(refetchedData)
        }
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error saving customer:', error)
    } finally {
      setSaving(false)
    }
  }

  // Ensure arrays have 4 items for display
  const ensureArrayLength = <T,>(arr: T[], emptyItem: T, length: number = 4): T[] => {
    const result = [...(arr || [])]
    while (result.length < length) {
      result.push({ ...emptyItem })
    }
    return result
  }

  const updateFormData = (field: keyof CustomerData, value: unknown) => {
    if (!formData) return
    setFormData({ ...formData, [field]: value })
  }

  const updateIndividualCuotaholder = (index: number, field: keyof PersonInfo, value: string) => {
    if (!formData) return
    const updated = ensureArrayLength(formData.individualCuotaholders || [], emptyPersonInfo)
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, individualCuotaholders: updated })
  }

  const updateCorporateCuotaholder = (index: number, field: keyof CorporateCuotaholder, value: string | boolean) => {
    if (!formData) return
    const updated = ensureArrayLength(formData.corporateCuotaholders || [], emptyCorporate)
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, corporateCuotaholders: updated })
  }

  const updateUbo = (index: number, field: keyof PersonInfo, value: string) => {
    if (!formData) return
    const updated = ensureArrayLength(formData.ubos || [], emptyPersonInfo)
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, ubos: updated })
  }

  const updateDirector = (index: number, field: keyof PersonInfo, value: string) => {
    if (!formData) return
    const updated = ensureArrayLength(formData.directors || [], emptyPersonInfo)
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, directors: updated })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{tCommon('loading')}</p>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Customer not found</p>
      </div>
    )
  }

  const individualCuotaholders = ensureArrayLength(formData.individualCuotaholders || [], emptyPersonInfo)
  const corporateCuotaholders = ensureArrayLength(formData.corporateCuotaholders || [], emptyCorporate)
  const ubos = ensureArrayLength(formData.ubos || [], emptyPersonInfo)
  const directors = ensureArrayLength(formData.directors || [], emptyPersonInfo)

  const inputClassName = isEditing ? 'h-8 text-sm border-slate-300' : 'h-8 text-sm border-slate-300 bg-slate-50'
  const textareaClassName = isEditing ? 'text-sm h-16 resize-none' : 'text-sm h-16 resize-none bg-slate-50'
  const largeInputClassName = isEditing ? 'max-w-xs text-2xl h-12' : 'max-w-xs text-2xl h-12 bg-slate-50'

  const renderPage1 = () => (
    <>
      {/* Section 1: Company Setup Information */}
      <div className="mb-8">
        <SectionTitle number={1} title={t('companySetupInfo')} sectionLabel={t('section')} />
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">
          ({t('noteNumberedCompanies')})
        </p>
      </div>

      {/* Section 2: Primary Contact(s) Information */}
      <div className="mb-8">
        <SectionTitle number={2} title={t('primaryContactInfo')} subtitle={t('primaryContactSubtitle')} sectionLabel={t('section')} />
        <div className="border border-slate-300 rounded overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-slate-300">
                <td className="bg-slate-100 dark:bg-slate-800 px-4 py-2 w-48 text-sm font-medium">{t('primaryContactName')}</td>
                <td className="px-2 py-2">
                  <Input
                    value={formData.primaryContactName || ''}
                    onChange={(e) => updateFormData('primaryContactName', e.target.value)}
                    readOnly={!isEditing}
                    className={inputClassName}
                  />
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium">{t('primaryContactEmail')}</td>
                <td className="px-2 py-2">
                  <Input
                    value={formData.primaryContactEmail || ''}
                    onChange={(e) => updateFormData('primaryContactEmail', e.target.value)}
                    readOnly={!isEditing}
                    className={inputClassName}
                  />
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium">{t('secondaryContactName')}</td>
                <td className="px-2 py-2">
                  <Input
                    value={formData.secondaryContactName || ''}
                    onChange={(e) => updateFormData('secondaryContactName', e.target.value)}
                    readOnly={!isEditing}
                    className={inputClassName}
                  />
                </td>
              </tr>
              <tr>
                <td className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium">{t('secondaryContactEmail')}</td>
                <td className="px-2 py-2">
                  <Input
                    value={formData.secondaryContactEmail || ''}
                    onChange={(e) => updateFormData('secondaryContactEmail', e.target.value)}
                    readOnly={!isEditing}
                    className={inputClassName}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Checkbox
            id="onlyPrimarySecondary"
            checked={formData.onlyPrimarySecondaryNotified}
            onCheckedChange={(checked) => updateFormData('onlyPrimarySecondaryNotified', checked)}
            disabled={!isEditing}
          />
          <label htmlFor="onlyPrimarySecondary" className="text-sm">{t('onlyPrimarySecondaryNotified')}</label>
        </div>
      </div>

      {/* Section 3: Individual Cuotaholder(s) Information */}
      <div className="mb-8">
        <SectionTitle number={3} title={t('individualCuotaholderInfo')} subtitle={t('individualCuotaholderSubtitle')} sectionLabel={t('section')} />
        <div className="border border-slate-300 rounded overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="px-4 py-2 text-left text-sm font-medium w-48 border-b border-r border-slate-300"></th>
                {[1, 2, 3, 4].map((num) => (
                  <th key={num} className="px-2 py-2 text-center text-sm font-medium border-b border-r border-slate-300 last:border-r-0">
                    {t('cuotaholder')} {num}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { key: 'lastName', label: t('lastName') },
                { key: 'givenNames', label: t('givenNames') },
                { key: 'fullAddress', label: t('fullAddress') },
                { key: 'passportNumber', label: t('passportNumber') },
                { key: 'expiryDate', label: t('expiryDate') },
                { key: 'dateOfBirth', label: t('dateOfBirth') },
                { key: 'placeOfBirth', label: t('placeOfBirth') },
                { key: 'countryOfTaxResidency', label: t('countryOfTaxResidency') },
                { key: 'emailAddress', label: t('emailAddress') },
                { key: 'telephoneNumber', label: t('telephoneNumber') },
                { key: 'profession', label: t('profession') },
                { key: 'maritalStatus', label: t('maritalStatus') },
                { key: 'numberOfSharesHeld', label: t('numberOfSharesHeld') },
              ].map(({ key, label }) => (
                <tr key={key} className="border-b border-slate-300 last:border-b-0">
                  <td className="bg-slate-100 dark:bg-slate-800 px-4 py-1 text-sm font-medium border-r border-slate-300">{label}</td>
                  {[0, 1, 2, 3].map((idx) => (
                    <td key={idx} className="px-1 py-1 border-r border-slate-300 last:border-r-0">
                      {key === 'fullAddress' ? (
                        <Textarea
                          value={individualCuotaholders[idx]?.[key as keyof PersonInfo] || ''}
                          onChange={(e) => updateIndividualCuotaholder(idx, key as keyof PersonInfo, e.target.value)}
                          readOnly={!isEditing}
                          className={textareaClassName}
                        />
                      ) : (
                        <Input
                          value={individualCuotaholders[idx]?.[key as keyof PersonInfo] || ''}
                          onChange={(e) => updateIndividualCuotaholder(idx, key as keyof PersonInfo, e.target.value)}
                          readOnly={!isEditing}
                          className={inputClassName}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Corporate Cuotaholder(s) Information */}
      <div className="mb-8">
        <SectionTitle number={4} title={t('corporateCuotaholderInfo')} subtitle={t('corporateCuotaholderSubtitle')} sectionLabel={t('section')} />
        <div className="border border-slate-300 rounded overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="px-4 py-2 text-left text-sm font-medium w-48 border-b border-r border-slate-300"></th>
                {[1, 2, 3, 4].map((num) => (
                  <th key={num} className="px-2 py-2 text-center text-sm font-medium border-b border-r border-slate-300 last:border-r-0">
                    {t('cuotaholder')} {num}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { key: 'companyName', label: t('companyName') },
                { key: 'registeredAddress', label: t('registeredAddress') },
                { key: 'taxIdRegistration', label: t('taxIdRegistration') },
                { key: 'jurisdiction', label: t('jurisdiction') },
                { key: 'dateOfIncorporation', label: t('dateOfIncorporation') },
                { key: 'uboSameAsNewCompany', label: t('uboSameAsNewCompany'), isCheckbox: true },
                { key: 'numberOfSharesHeld', label: t('numberOfSharesHeld') },
              ].map(({ key, label, isCheckbox }) => (
                <tr key={key} className="border-b border-slate-300 last:border-b-0">
                  <td className="bg-slate-100 dark:bg-slate-800 px-4 py-1 text-sm font-medium border-r border-slate-300">{label}</td>
                  {[0, 1, 2, 3].map((idx) => (
                    <td key={idx} className="px-1 py-1 border-r border-slate-300 last:border-r-0">
                      {isCheckbox ? (
                        <div className="flex justify-center">
                          <Checkbox
                            checked={corporateCuotaholders[idx]?.uboSameAsNewCompany || false}
                            onCheckedChange={(checked) => updateCorporateCuotaholder(idx, 'uboSameAsNewCompany', checked as boolean)}
                            disabled={!isEditing}
                          />
                        </div>
                      ) : key === 'registeredAddress' ? (
                        <Textarea
                          value={corporateCuotaholders[idx]?.[key as keyof CorporateCuotaholder] as string || ''}
                          onChange={(e) => updateCorporateCuotaholder(idx, key as keyof CorporateCuotaholder, e.target.value)}
                          readOnly={!isEditing}
                          className={textareaClassName}
                        />
                      ) : (
                        <Input
                          value={corporateCuotaholders[idx]?.[key as keyof CorporateCuotaholder] as string || ''}
                          onChange={(e) => updateCorporateCuotaholder(idx, key as keyof CorporateCuotaholder, e.target.value)}
                          readOnly={!isEditing}
                          className={inputClassName}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )

  const renderPage2 = () => (
    <>
      {/* Section 5: Ultimate Beneficial Owner(s) */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-base font-semibold text-blue-800 dark:text-blue-400">
            {t('section')} 5 – {t('ultimateBeneficialOwners')}
          </h3>
          <span className="text-sm">{t('checkIfUboSame')}</span>
          <Checkbox
            checked={formData.uboSameAsCuotaholder}
            onCheckedChange={(checked) => updateFormData('uboSameAsCuotaholder', checked)}
            disabled={!isEditing}
          />
        </div>
        <div className="border border-slate-300 rounded overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="px-4 py-2 text-left text-sm font-medium w-48 border-b border-r border-slate-300"></th>
                {[1, 2, 3, 4].map((num) => (
                  <th key={num} className="px-2 py-2 text-center text-sm font-medium border-b border-r border-slate-300 last:border-r-0">
                    UBO {num}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { key: 'lastName', label: t('lastName') },
                { key: 'givenNames', label: t('givenNames') },
                { key: 'fullAddress', label: t('fullAddress') },
                { key: 'passportNumber', label: t('passportNumber') },
                { key: 'expiryDate', label: t('expiryDate') },
                { key: 'dateOfBirth', label: t('dateOfBirth') },
                { key: 'placeOfBirth', label: t('placeOfBirth') },
                { key: 'countryOfTaxResidency', label: t('countryOfTaxResidency') },
                { key: 'emailAddress', label: t('emailAddress') },
                { key: 'telephoneNumber', label: t('telephoneNumber') },
                { key: 'profession', label: t('profession') },
                { key: 'maritalStatus', label: t('maritalStatus') },
                { key: 'ownershipPercentage', label: t('ownershipPercentage') },
              ].map(({ key, label }) => (
                <tr key={key} className="border-b border-slate-300 last:border-b-0">
                  <td className="bg-slate-100 dark:bg-slate-800 px-4 py-1 text-sm font-medium border-r border-slate-300">{label}</td>
                  {[0, 1, 2, 3].map((idx) => (
                    <td key={idx} className="px-1 py-1 border-r border-slate-300 last:border-r-0">
                      {key === 'fullAddress' ? (
                        <Textarea
                          value={ubos[idx]?.[key as keyof PersonInfo] || ''}
                          onChange={(e) => updateUbo(idx, key as keyof PersonInfo, e.target.value)}
                          readOnly={!isEditing}
                          className={textareaClassName}
                        />
                      ) : (
                        <Input
                          value={ubos[idx]?.[key as keyof PersonInfo] || ''}
                          onChange={(e) => updateUbo(idx, key as keyof PersonInfo, e.target.value)}
                          readOnly={!isEditing}
                          className={inputClassName}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 6: Managing Director(s) */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-base font-semibold text-blue-800 dark:text-blue-400">
            {t('section')} 6 – {t('managingDirectors')}
          </h3>
          <span className="text-sm">{t('checkIfDirectorSame')}</span>
          <Checkbox
            checked={formData.directorSameAsCuotaholder}
            onCheckedChange={(checked) => updateFormData('directorSameAsCuotaholder', checked)}
            disabled={!isEditing}
          />
        </div>
        <div className="border border-slate-300 rounded overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="px-4 py-2 text-left text-sm font-medium w-48 border-b border-r border-slate-300"></th>
                {[1, 2, 3, 4].map((num) => (
                  <th key={num} className="px-2 py-2 text-center text-sm font-medium border-b border-r border-slate-300 last:border-r-0">
                    {t('director')} {num}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { key: 'lastName', label: t('lastName') },
                { key: 'givenNames', label: t('givenNames') },
                { key: 'fullAddress', label: t('fullAddress') },
                { key: 'passportNumber', label: t('passportNumber') },
                { key: 'expiryDate', label: t('expiryDate') },
                { key: 'dateOfBirth', label: t('dateOfBirth') },
                { key: 'placeOfBirth', label: t('placeOfBirth') },
                { key: 'countryOfTaxResidency', label: t('countryOfTaxResidency') },
                { key: 'emailAddress', label: t('emailAddress') },
                { key: 'telephoneNumber', label: t('telephoneNumber') },
                { key: 'profession', label: t('profession') },
                { key: 'maritalStatus', label: t('maritalStatus') },
              ].map(({ key, label }) => (
                <tr key={key} className="border-b border-slate-300 last:border-b-0">
                  <td className="bg-slate-100 dark:bg-slate-800 px-4 py-1 text-sm font-medium border-r border-slate-300">{label}</td>
                  {[0, 1, 2, 3].map((idx) => (
                    <td key={idx} className="px-1 py-1 border-r border-slate-300 last:border-r-0">
                      {key === 'fullAddress' ? (
                        <Textarea
                          value={directors[idx]?.[key as keyof PersonInfo] || ''}
                          onChange={(e) => updateDirector(idx, key as keyof PersonInfo, e.target.value)}
                          readOnly={!isEditing}
                          className={textareaClassName}
                        />
                      ) : (
                        <Input
                          value={directors[idx]?.[key as keyof PersonInfo] || ''}
                          onChange={(e) => updateDirector(idx, key as keyof PersonInfo, e.target.value)}
                          readOnly={!isEditing}
                          className={inputClassName}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cuotas Information */}
      <div className="mb-8">
        <div className="border border-slate-300 rounded overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-slate-300">
                <td className="bg-slate-100 dark:bg-slate-800 px-4 py-3 w-64">
                  <div className="text-sm font-medium">{t('nominalValueOfCuotas')}</div>
                  <div className="text-xs text-muted-foreground">({t('defaultNominalValue')})</div>
                </td>
                <td className="px-4 py-3">
                  <Input
                    value={formData.nominalValueOfCuotas || ''}
                    onChange={(e) => updateFormData('nominalValueOfCuotas', e.target.value)}
                    readOnly={!isEditing}
                    className={largeInputClassName}
                  />
                </td>
              </tr>
              <tr>
                <td className="bg-slate-100 dark:bg-slate-800 px-4 py-3">
                  <div className="text-sm font-medium">{t('numberOfCuotasToBeIssued')}</div>
                  <div className="text-xs text-muted-foreground">({t('defaultCuotas')})</div>
                </td>
                <td className="px-4 py-3">
                  <Input
                    value={formData.numberOfCuotasToBeIssued || ''}
                    onChange={(e) => updateFormData('numberOfCuotasToBeIssued', e.target.value)}
                    readOnly={!isEditing}
                    className={largeInputClassName}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Nature of Business */}
      <div className="mb-8">
        <div className="border border-slate-300 rounded overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="bg-slate-100 dark:bg-slate-800 px-4 py-3 w-64 align-top">
                  <div className="text-sm font-medium">{t('natureOfBusiness')}</div>
                </td>
                <td className="px-4 py-3">
                  <Input
                    value={formData.natureOfBusiness || ''}
                    onChange={(e) => updateFormData('natureOfBusiness', e.target.value)}
                    readOnly={!isEditing}
                    className={isEditing ? 'text-2xl h-12' : 'text-2xl h-12 bg-slate-50'}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Form Header */}
        <FormHeader t={t} />

        {/* Edit/Save/Cancel Buttons */}
        <div className="flex justify-end gap-2 mb-4 print:hidden">
          {isEditing ? (
            <>
              <Button onClick={handleCancel} variant="outline">
                {tCommon('cancel')}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? tCommon('saving') : tCommon('save')}
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} variant="outline" className="gap-2">
              <Pencil className="h-4 w-4" />
              {tCommon('edit')}
            </Button>
          )}
        </div>

        {/* Page Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6 print:hidden">
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
              currentPage === 1
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            1
          </button>
          <div className="w-8 h-0.5 bg-slate-300 dark:bg-slate-600" />
          <button
            type="button"
            onClick={() => setCurrentPage(2)}
            className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
              currentPage === 2
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            2
          </button>
        </div>

        {currentPage === 1 ? renderPage1() : renderPage2()}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t print:hidden">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            {t('previousPage')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentPage(2)}
            disabled={currentPage === 2}
          >
            {t('nextPage')}
          </Button>
        </div>
      </div>
    </div>
  )
}
