'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, ChevronLeft, ChevronRight, Upload } from 'lucide-react'

interface CustomerFormInlineProps {
  onSave?: () => void
}

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

const emptyPersonInfo = (): PersonInfo => ({
  lastName: '',
  givenNames: '',
  fullAddress: '',
  passportNumber: '',
  expiryDate: '',
  dateOfBirth: '',
  placeOfBirth: '',
  countryOfTaxResidency: '',
  emailAddress: '',
  telephoneNumber: '',
  profession: '',
  maritalStatus: '',
  numberOfSharesHeld: '',
  ownershipPercentage: '',
})

const emptyCorporateCuotaholder = (): CorporateCuotaholder => ({
  companyName: '',
  registeredAddress: '',
  taxIdRegistration: '',
  jurisdiction: '',
  dateOfIncorporation: '',
  uboSameAsNewCompany: false,
  numberOfSharesHeld: '',
})

const getInitialFormData = () => ({
  // Section 2: Primary Contact(s) Information
  primaryContactName: '',
  primaryContactEmail: '',
  secondaryContactName: '',
  secondaryContactEmail: '',
  onlyPrimarySecondaryNotified: false,

  // Section 3: Individual Cuotaholder(s) Information
  individualCuotaholders: [emptyPersonInfo(), emptyPersonInfo(), emptyPersonInfo(), emptyPersonInfo()],

  // Section 4: Corporate Cuotaholder(s) Information
  corporateCuotaholders: [emptyCorporateCuotaholder(), emptyCorporateCuotaholder(), emptyCorporateCuotaholder(), emptyCorporateCuotaholder()],

  // Section 5: Ultimate Beneficial Owner(s)
  uboSameAsCuotaholder: false,
  ubos: [emptyPersonInfo(), emptyPersonInfo(), emptyPersonInfo(), emptyPersonInfo()],

  // Section 6: Managing Director(s)
  directorSameAsCuotaholder: false,
  directors: [emptyPersonInfo(), emptyPersonInfo(), emptyPersonInfo(), emptyPersonInfo()],

  // Additional fields
  nominalValueOfCuotas: '100',
  numberOfCuotasToBeIssued: '1000',
  natureOfBusiness: '',
})

// Mock data for testing - fills all form fields with sample data
const getMockFormData = () => {
  const mockPerson = (index: number): PersonInfo => ({
    lastName: `Smith${index + 1}`,
    givenNames: `John${index + 1}`,
    fullAddress: `${100 + index} Main Street, Suite ${index + 1}\nSan José, Costa Rica 10101`,
    passportNumber: `P${String(index + 1).padStart(8, '0')}`,
    expiryDate: '2028-12-31',
    dateOfBirth: `198${index}-0${index + 1}-1${index}`,
    placeOfBirth: ['New York, USA', 'London, UK', 'Madrid, Spain', 'Toronto, Canada'][index],
    countryOfTaxResidency: ['United States', 'United Kingdom', 'Spain', 'Canada'][index],
    emailAddress: `john.smith${index + 1}@example.com`,
    telephoneNumber: `+1-555-000-000${index + 1}`,
    profession: ['Software Engineer', 'Attorney', 'Accountant', 'Business Consultant'][index],
    maritalStatus: ['Single', 'Married', 'Married', 'Single'][index],
    numberOfSharesHeld: `${250 * (index + 1)}`,
    ownershipPercentage: `${25}`,
  })

  const mockCorporate = (index: number): CorporateCuotaholder => ({
    companyName: `Acme Holdings ${index + 1} LLC`,
    registeredAddress: `${200 + index} Corporate Blvd\nDelaware, USA 19801`,
    taxIdRegistration: `US-${String(index + 1).padStart(9, '0')}`,
    jurisdiction: ['Delaware, USA', 'British Virgin Islands', 'Cayman Islands', 'Panama'][index],
    dateOfIncorporation: `201${index}-0${index + 1}-01`,
    uboSameAsNewCompany: index === 0,
    numberOfSharesHeld: `${250 * (index + 1)}`,
  })

  return {
    // Section 2: Primary Contact(s) Information
    primaryContactName: 'Maria Garcia',
    primaryContactEmail: 'maria.garcia@fastoffshore.com',
    secondaryContactName: 'Carlos Rodriguez',
    secondaryContactEmail: 'carlos.rodriguez@fastoffshore.com',
    onlyPrimarySecondaryNotified: true,

    // Section 3: Individual Cuotaholder(s) Information
    individualCuotaholders: [mockPerson(0), mockPerson(1), mockPerson(2), mockPerson(3)],

    // Section 4: Corporate Cuotaholder(s) Information
    corporateCuotaholders: [mockCorporate(0), mockCorporate(1), mockCorporate(2), mockCorporate(3)],

    // Section 5: Ultimate Beneficial Owner(s)
    uboSameAsCuotaholder: false,
    ubos: [mockPerson(0), mockPerson(1), mockPerson(2), mockPerson(3)],

    // Section 6: Managing Director(s)
    directorSameAsCuotaholder: false,
    directors: [mockPerson(0), mockPerson(1), emptyPersonInfo(), emptyPersonInfo()],

    // Additional fields
    nominalValueOfCuotas: '100',
    numberOfCuotasToBeIssued: '1000',
    natureOfBusiness: 'International trading and consulting services',
  }
}

// Header Component - defined outside to prevent re-creation on state changes
function FormHeader({ t }: { t: (key: string) => string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between py-4">
        {/* Left side - Warning text */}
        <div className="text-[#4a4a8a] dark:text-blue-400">
          <p className="text-lg italic font-medium">! {t('formsMustBeDigital')}</p>
          <p className="text-lg italic font-medium">{t('handwrittenNotAccepted')}</p>
        </div>

        {/* Right side - Fast Offshore Logo */}
        <div className="flex items-center gap-3">
          {/* Logo Icon */}
          <div className="w-14 h-14 bg-[#4a4a8a] rounded flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 8H24V12H12V16H20V20H12V28H8V8Z" fill="white"/>
              <path d="M14 12L20 12" stroke="#c9a227" strokeWidth="2"/>
              <path d="M14 20L18 20" stroke="#c9a227" strokeWidth="2"/>
            </svg>
          </div>
          {/* Logo Text */}
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
      {/* Bottom border line */}
      <div className="border-b-2 border-[#4a4a8a] dark:border-slate-500" />
    </div>
  )
}

// Section title component - defined outside to prevent re-creation
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

export function CustomerFormInline({ onSave }: CustomerFormInlineProps) {
  const t = useTranslations('companyForm')
  const tCommon = useTranslations('common')

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(getInitialFormData())
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const handleSave = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData(getInitialFormData())
        setShowSuccess(true)
        setCurrentPage(1)
        setTimeout(() => setShowSuccess(false), 3000)
        onSave?.()
      }
    } catch (error) {
      console.error('Error saving customer:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateIndividualCuotaholder = (index: number, field: keyof PersonInfo, value: string) => {
    const updated = [...formData.individualCuotaholders]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, individualCuotaholders: updated })
  }

  const updateCorporateCuotaholder = (index: number, field: keyof CorporateCuotaholder, value: string | boolean) => {
    const updated = [...formData.corporateCuotaholders]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, corporateCuotaholders: updated })
  }

  const updateUbo = (index: number, field: keyof PersonInfo, value: string) => {
    const updated = [...formData.ubos]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, ubos: updated })
  }

  const updateDirector = (index: number, field: keyof PersonInfo, value: string) => {
    const updated = [...formData.directors]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, directors: updated })
  }

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
                    value={formData.primaryContactName}
                    onChange={(e) => setFormData({ ...formData, primaryContactName: e.target.value })}
                    className="h-8 text-sm border-slate-300"
                  />
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium">{t('primaryContactEmail')}</td>
                <td className="px-2 py-2">
                  <Input
                    value={formData.primaryContactEmail}
                    onChange={(e) => setFormData({ ...formData, primaryContactEmail: e.target.value })}
                    className="h-8 text-sm border-slate-300"
                  />
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium">{t('secondaryContactName')}</td>
                <td className="px-2 py-2">
                  <Input
                    value={formData.secondaryContactName}
                    onChange={(e) => setFormData({ ...formData, secondaryContactName: e.target.value })}
                    className="h-8 text-sm border-slate-300"
                  />
                </td>
              </tr>
              <tr>
                <td className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium">{t('secondaryContactEmail')}</td>
                <td className="px-2 py-2">
                  <Input
                    value={formData.secondaryContactEmail}
                    onChange={(e) => setFormData({ ...formData, secondaryContactEmail: e.target.value })}
                    className="h-8 text-sm border-slate-300"
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
            onCheckedChange={(checked) => setFormData({ ...formData, onlyPrimarySecondaryNotified: checked as boolean })}
          />
          <label htmlFor="onlyPrimarySecondary" className="text-sm">
            {t('onlyPrimarySecondaryNotified')}
          </label>
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
                          value={formData.individualCuotaholders[idx][key as keyof PersonInfo] || ''}
                          onChange={(e) => updateIndividualCuotaholder(idx, key as keyof PersonInfo, e.target.value)}
                          className="text-sm h-16 resize-none"
                        />
                      ) : (
                        <Input
                          value={formData.individualCuotaholders[idx][key as keyof PersonInfo] || ''}
                          onChange={(e) => updateIndividualCuotaholder(idx, key as keyof PersonInfo, e.target.value)}
                          className="h-8 text-sm border-slate-300"
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
                            checked={formData.corporateCuotaholders[idx].uboSameAsNewCompany}
                            onCheckedChange={(checked) => updateCorporateCuotaholder(idx, 'uboSameAsNewCompany', checked as boolean)}
                          />
                        </div>
                      ) : key === 'registeredAddress' ? (
                        <Textarea
                          value={formData.corporateCuotaholders[idx][key as keyof CorporateCuotaholder] as string || ''}
                          onChange={(e) => updateCorporateCuotaholder(idx, key as keyof CorporateCuotaholder, e.target.value)}
                          className="text-sm h-16 resize-none"
                        />
                      ) : (
                        <Input
                          value={formData.corporateCuotaholders[idx][key as keyof CorporateCuotaholder] as string || ''}
                          onChange={(e) => updateCorporateCuotaholder(idx, key as keyof CorporateCuotaholder, e.target.value)}
                          className="h-8 text-sm border-slate-300"
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
            onCheckedChange={(checked) => setFormData({ ...formData, uboSameAsCuotaholder: checked as boolean })}
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
                          value={formData.ubos[idx][key as keyof PersonInfo] || ''}
                          onChange={(e) => updateUbo(idx, key as keyof PersonInfo, e.target.value)}
                          className="text-sm h-16 resize-none"
                          disabled={formData.uboSameAsCuotaholder}
                        />
                      ) : (
                        <Input
                          value={formData.ubos[idx][key as keyof PersonInfo] || ''}
                          onChange={(e) => updateUbo(idx, key as keyof PersonInfo, e.target.value)}
                          className={`h-8 text-sm border-slate-300 ${formData.uboSameAsCuotaholder ? 'opacity-50' : ''}`}
                          disabled={formData.uboSameAsCuotaholder}
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
            onCheckedChange={(checked) => setFormData({ ...formData, directorSameAsCuotaholder: checked as boolean })}
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
                          value={formData.directors[idx][key as keyof PersonInfo] || ''}
                          onChange={(e) => updateDirector(idx, key as keyof PersonInfo, e.target.value)}
                          className="text-sm h-16 resize-none"
                          disabled={formData.directorSameAsCuotaholder}
                        />
                      ) : (
                        <Input
                          value={formData.directors[idx][key as keyof PersonInfo] || ''}
                          onChange={(e) => updateDirector(idx, key as keyof PersonInfo, e.target.value)}
                          className={`h-8 text-sm border-slate-300 ${formData.directorSameAsCuotaholder ? 'opacity-50' : ''}`}
                          disabled={formData.directorSameAsCuotaholder}
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
                    value={formData.nominalValueOfCuotas}
                    onChange={(e) => setFormData({ ...formData, nominalValueOfCuotas: e.target.value })}
                    className="max-w-xs text-2xl h-12"
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
                    value={formData.numberOfCuotasToBeIssued}
                    onChange={(e) => setFormData({ ...formData, numberOfCuotasToBeIssued: e.target.value })}
                    className="max-w-xs text-2xl h-12"
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
                    value={formData.natureOfBusiness}
                    onChange={(e) => setFormData({ ...formData, natureOfBusiness: e.target.value })}
                    className="text-2xl h-12"
                    placeholder={t('natureOfBusinessPlaceholder')}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )

  const handleImportMockData = () => {
    setFormData(getMockFormData())
  }

  return (
    <div>
      {/* Form Header */}
      <FormHeader t={t} />

      {/* Import Mock Data Button - for development testing */}
      <div className="flex justify-end mb-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleImportMockData}
          className="gap-2 text-orange-600 border-orange-300 hover:bg-orange-50 hover:text-orange-700 dark:text-orange-400 dark:border-orange-700 dark:hover:bg-orange-950"
        >
          <Upload className="h-4 w-4" />
          Import Mock Data
        </Button>
      </div>

      {showSuccess && (
        <div className="flex items-center gap-2 p-4 mb-6 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
          <CheckCircle className="h-5 w-5" />
          {t('companySaved')}
        </div>
      )}

      {/* Page Indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
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

      {/* Navigation and Submit */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('previousPage')}
        </Button>

        <div className="flex gap-3">
          {currentPage === 1 ? (
            <Button type="button" onClick={() => setCurrentPage(2)} className="gap-2">
              {t('nextPage')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSave} disabled={loading} size="lg">
              {loading ? tCommon('saving') : tCommon('save')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
