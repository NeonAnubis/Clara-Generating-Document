import { Customer, DocumentTemplate, GeneratedDocument, ExportHistory } from '@prisma/client'

export type { Customer, DocumentTemplate, GeneratedDocument, ExportHistory }

export interface PersonInfo {
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

export interface CorporateCuotaholder {
  companyName: string
  registeredAddress: string
  taxIdRegistration: string
  jurisdiction: string
  dateOfIncorporation: string
  uboSameAsNewCompany: boolean
  numberOfSharesHeld: string
}

export interface CustomerFormData {
  companyName: string
  companyType: string
  abbreviation: string
  legalId: string
  shareCapital: string
  numberOfShares: string
  shareValue: string
  series: string
  registeredAddress: string
  companyTerm: number
  incorporationDate: string
}

export interface TemplateFormData {
  name: string
  description?: string
  content: string
  category?: string
  fieldMappings: string[]
  isActive: boolean
}

export const CUSTOMER_FIELDS = [
  { key: 'companyName', label: 'Company Name', required: false },
  { key: 'companyType', label: 'Company Type', required: false },
  { key: 'legalId', label: 'Legal ID', required: false },
  { key: 'shareholderOne', label: 'Shareholder One', required: false },
  { key: 'shareholderTwo', label: 'Shareholder Two', required: false },
  { key: 'email', label: 'Email', required: false },
  { key: 'shareValue', label: 'Share Value', required: false },
  { key: 'numberOfShares', label: 'Number of Shares', required: false },
] as const

export const CUSTOMER_STATUS = [
  'active',
  'inactive',
  'pending',
] as const
