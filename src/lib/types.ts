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
  status: string
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
  { key: 'primaryContactName', label: 'Primary Contact Name', required: false },
  { key: 'primaryContactEmail', label: 'Primary Contact Email', required: false },
  { key: 'secondaryContactName', label: 'Secondary Contact Name', required: false },
  { key: 'secondaryContactEmail', label: 'Secondary Contact Email', required: false },
  { key: 'natureOfBusiness', label: 'Nature of Business', required: false },
  { key: 'nominalValueOfCuotas', label: 'Nominal Value of Cuotas', required: false },
  { key: 'numberOfCuotasToBeIssued', label: 'Number of Cuotas', required: false },
] as const

export const CUSTOMER_STATUS = [
  'active',
  'inactive',
  'pending',
] as const
